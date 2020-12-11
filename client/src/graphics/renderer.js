var _renderer = null;

/**
 * Specifies a WebGL render. Used alongside Spring 2019 CMPS 160's Scene,
 * Camera, Geometry, and other subclasses.
 *
 * @author Lucas N. Ferreira
 * @this {Renderer}
 */
class Renderer {
  /**
   * Constructor for Renderer.
   *
   * @constructor
   * @returns {Renderer} Renderer object created
   */
  constructor(gl, scene, camera, hud, ctx) {
    this.gl = gl;
    this.scene = scene;
    this.camera = camera;
    this.hud = hud;
    this.ctx = ctx;
    this.time = 0;
    this.asteroidCount = 0;
    this.pause = false;
    this.pauseid;

    this.textures = {};

    this.initGLSLBuffers();

    // Setting canvas' clear color
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Use the z-buffer when drawing
    this.gl.enable(gl.DEPTH_TEST);

    _renderer = this;
  }

  /**
   * Starts an animation loop
   */
  start() {
    _renderer.render();
    this.pauseid = requestAnimationFrame(_renderer.start);
  }

  /**
   * Renders all the geometry within the scene.
   */
  render() {
    if (this.time == 1) {
      this.pause = true;
      // Draw the Start Screen
      this.ctx.clearRect(0, 0, 600, 600); // Clear <hud>
      this.ctx.font = '22px "Times New Roman"';
      this.ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Set white to the color of letters
      this.ctx.fillText('Click Anywhere to Begin', 180, 200);
      //Controls
      this.ctx.fillText('Controls:', 130, 390);
      this.ctx.font = '18px "Times New Roman"';
      this.ctx.fillText('W - Boost forward', 130, 420);
      this.ctx.fillText('A - Left rotate', 130, 440);
      this.ctx.fillText('D - Right rotate', 130, 460);
      this.ctx.fillText('Space - Fire laser', 130, 480);
      //Scoring
      this.ctx.font = '22px "Times New Roman"';
      this.ctx.fillText('Playing:', 320, 390);
      this.ctx.font = '18px "Times New Roman"';
      this.ctx.fillText('-Stay alive as long as possible by', 320, 420);
      this.ctx.fillText(' avoiding and destroying asteroids.', 320, 440);
      this.ctx.fillText('-Score is based on time alive', 320, 460);
      this.ctx.fillText(' and asteroids destroyed.', 320, 480);
    }
    if (!this.pause) {
      if (this.scene.geometries[0].id == "ship") this.time++;
      this.asteroidCount = 0;
      // Clear the geometry onscreen
      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

      //loop for collision detection
      for (var i = 0; i < this.scene.geometries.length; i++) {
        var geometry = this.scene.geometries[i];
        switch (geometry.id) {
          case "ship":
            for (var f = 1; f < this.scene.geometries.length; f++) {
              var nextGeo = this.scene.geometries[f];
              if (nextGeo.id == "ast") {
                var aX = geometry.posVec.elements[0];
                var aY = geometry.posVec.elements[1];
                var bX = nextGeo.posVec.elements[0];
                var bY = nextGeo.posVec.elements[1];

                var xDiff = aX - bX;
                var yDiff = aY - bY;
                var Dist = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));

                if (Dist < nextGeo.size && geometry.time > 5 && nextGeo.time > 5) {
                  var explo = new Explosion(shader, aX, aY);
                  this.scene.geometries.splice(i, 1, explo);
                }
              }
            }
            break;

          case "bullet":
            if (geometry.time > 30) {
              this.scene.geometries.splice(i, 1);
              // console.log(geometry.time)
              // console.log(geometry.posVec.elements[0], geometry.posVec.elements[0]);
              // console.log(geometry.transMatrix.elements);
            }
            for (var f = 0; f < this.scene.geometries.length; f++) {
              var nextGeo = this.scene.geometries[f];
              if (nextGeo.id == "ast") {
                var aX = geometry.posVec.elements[0];
                var aY = geometry.posVec.elements[1];
                var bX = nextGeo.posVec.elements[0];
                var bY = nextGeo.posVec.elements[1];

                var xDiff = aX - bX;
                var yDiff = aY - bY;
                var Dist = Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));

                if (Dist < nextGeo.size && nextGeo.time > 5) {
                  //console.log("zap", Dist, nextGeo.size, geometry.time);
                  this.time += 100;
                  this.scene.geometries.splice(i, 1);
                  if (nextGeo.size > .1) {
                    var ast1 = new Asteroid(shader, nextGeo.size / 2, bX, bY);
                    var ast2 = new Asteroid(shader, nextGeo.size / 2, bX, bY);
                    this.scene.geometries.splice(f, 1, ast1, ast2);
                  }
                  else this.scene.geometries.splice(f, 1);

                }
              }
            }
            break;
        }
      }

      //loop for rendering geometries
      for (var i = 0; i < this.scene.geometries.length; i++) {
        var geometry = this.scene.geometries[i];

        // Switch to shader attached to geometry
        this.gl.useProgram(geometry.shader.program)
        this.gl.program = geometry.shader.program

        // Callback function in the case user wants to change the
        // geometry before the draw call
        geometry.render();

        if (geometry.image != null) {
          if (!(geometry.image.src in this.textures)) {
            // Create a texture object and store id using its path as key
            this.textures[geometry.image.src] = this.gl.createTexture();
            this.loadTexture(this.textures[geometry.image.src], geometry.image);
          }
        }

        //count how many asteroids are in play
        if (geometry.id == "ast") this.asteroidCount++;

        // Draw geometry
        this.sendVertexDataToGLSL(geometry.data, geometry.dataCounts, geometry.shader);
        this.sendIndicesToGLSL(geometry.indices);

        this.drawBuffer(geometry.indices.length)
      }

      //Method to repopulate asteroids
      //if there are fewer than 6 asteroid in play, add a new one
      if (this.asteroidCount < 8 && this.scene.geometries[0].id == "ship") {
        //console.log("adding asteroid");
        var ast = new Asteroid(shader, ((Math.random() * 2) + 1) / 10, 1.15, 1.15);
        this.scene.addGeometry(ast);
      }


      // Draw the HUD
      this.ctx.clearRect(0, 0, 600, 600); // Clear <hud>
      this.ctx.font = '18px "Times New Roman"';
      this.ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Set white to the color of letters
      this.ctx.fillText('Current Score: ' + Math.round(this.time / 5), 20, 50);
      //restart button
      this.ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // Set black to the color
      this.ctx.fillRect(500, 30, 80, 30);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Set white to the color of letters
      this.ctx.fillText('Restart', 515, 50);
      this.ctx.beginPath();                      // Start drawing
      this.ctx.moveTo(500, 30); this.ctx.lineTo(580, 30); this.ctx.lineTo(580, 60); this.ctx.lineTo(500, 60);
      this.ctx.closePath();
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 1)'; // Set white to color of lines
      this.ctx.stroke();
      //pause button
      this.ctx.fillStyle = 'rgba(0, 0, 0, 1)'; // Set black to the color
      this.ctx.fillRect(500, 70, 80, 30);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Set white to the color of letters
      this.ctx.fillText('Pause', 520, 90);
      this.ctx.beginPath();                      // Start drawing
      this.ctx.moveTo(500, 70); this.ctx.lineTo(580, 70); this.ctx.lineTo(580, 100); this.ctx.lineTo(500, 100);
      this.ctx.closePath();
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 1)'; // Set white to color of lines
      this.ctx.stroke();
      //if game over
      if (this.scene.geometries[0].id != "ship") {
        this.ctx.font = '64px "Times New Roman"';
        this.ctx.fillStyle = 'rgba(255, 0, 0, 1)'; // Set red to the color of letters
        this.ctx.fillText('Game Over', 150, 250);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 1)'; // Set white to color of text
        this.ctx.fillText('Final Score: ' + Math.round(this.time / 5), 50, 325);
      }
    }

  }

  /**
   * Initializes a single index and single attribute buffer for future use
   */
  initGLSLBuffers() {
    var attributeBuffer = this.gl.createBuffer();
    var indexBuffer = this.gl.createBuffer();

    if (!attributeBuffer || !indexBuffer) {
      console.log("Failed to create buffers!");
      return;
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, attributeBuffer);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  }

  /**
   * Sends an array of interleaved vertex information the shader.
   *
   * @private
   * @param {Float32Array} data Data being sent to attribute variable
   * @param {Number} dataCount The amount of data to pass per vertex
   * @param {String} attribName The name of the attribute variable
   */
  sendVertexDataToGLSL(data, dataCounts, shader) {
    var FSIZE = data.BYTES_PER_ELEMENT;

    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

    var dataEnd = 0;
    for (var i = 0; i < dataCounts.length; i++) {
      dataEnd += dataCounts[i];
    }
    dataEnd *= FSIZE;

    var i = 0;
    var currentDataStart = 0;

    // Send attributes
    for (const attributeName in shader.attributes) {
      var attribute = shader.attributes[attributeName].location;

      this.gl.vertexAttribPointer(attribute, dataCounts[i], this.gl.FLOAT, false, dataEnd, currentDataStart);
      this.gl.enableVertexAttribArray(attribute);

      currentDataStart += FSIZE * dataCounts[i];
      i += 1;
    }

    // Send uniforms
    for (const uniformName in shader.uniforms) {
      this.sendUniformToGLSL(shader.uniforms[uniformName]);
    }
  }

  /**
   * Passes a uniform's value to it's saved location
   * @private
   * @param uniform An associative array with the location and value of a uniform
   */
  sendUniformToGLSL(uniform) {
    switch (uniform.type) {
      case "float":
        this.gl.uniform1f(uniform.location, uniform.value);
        break;
      case "vec2":
        this.gl.uniform2fv(uniform.location, uniform.value);
        break;
      case "vec3":
        this.gl.uniform3fv(uniform.location, uniform.value);
        break;
      case "vec4":
        this.gl.uniform4fv(uniform.location, uniform.value);
        break;
      case "mat2":
        this.gl.uniformMatrix2fv(uniform.location, false, uniform.value);
        break;
      case "mat3":
        this.gl.uniformMatrix3fv(uniform.location, false, uniform.value);
        break;
      case "mat4":
        this.gl.uniformMatrix4fv(uniform.location, false, uniform.value);
        break;
      case "sampler2D":
        this.gl.uniform1i(uniform.location, uniform.value);
        break;
    }
  }

  /**
   * Passes the indices of a geometry to the index buffer
   *
   * @private
   * @param {Uint16Array} indices An array of indices
   */
  sendIndicesToGLSL(indices) {
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, indices, this.gl.STATIC_DRAW);
  }

  /**
   * Draws the current buffer loaded. The buffer was loaded by sendVerticesToGLSL.
   *
   * @param {Integer} pointCount The amount of vertices being drawn from the buffer.
   */
  drawBuffer(indicesLength) {
    this.gl.drawElements(this.gl.TRIANGLES, indicesLength, this.gl.UNSIGNED_SHORT, 0);
  }

  loadTexture(texture, image) {
    // Flip the image's y axis
    this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, 1);

    // Enable texture unit0
    this.gl.activeTexture(this.gl.TEXTURE0);

    // Bind the texture object to the target
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);

    // Set the texture parameters
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);

    // Set the texture image
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
  }
}
