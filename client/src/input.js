var _inputHandler = null;

/**
 * Specifies a Input Handler. Used to parse input events from a HTML page.
 *
 * @author Lucas N. Ferreira
 * @this {Scene}
 */
class InputHandler {
  /**
   * Initializes the event handeling functions within the program.
   */
  constructor(canvas, scene, hud, hudscene) {
    this.canvas = canvas;
    this.scene = scene;
    this.hud = canvas;
    this.hudscene = hudscene;

    this.gl = getWebGLContext(canvas);
    _inputHandler = this;
    this.shootReady = true;

    this.image = null;

    // Mouse Events
    //this.canvas.onmousedown = function (ev) { this.mouseheld = true; _inputHandler.click(ev); };
    // this.hud.onmouseup = function () { this.mouseheld = false; };
    // this.hud.onmousemove = function (ev) { if (this.mouseheld) { _inputHandler.click(ev) } };

    //button events
    //document.getElementById("clear").onclick = function () { _inputHandler.clear(); };
    document.addEventListener('keydown', function (ev) { _inputHandler.keyDown(ev); }, false);
    document.addEventListener('keyup', function (ev) { _inputHandler.keyUp(ev); }, false);
  }

  // /**
  //  * Function called upon mouse click.
  //  */
  // click(ev) {
  //   // Print x,y coordinates.
  //   console.log(ev.clientX, ev.clientY);
  //   //Convert coordinates to webgl style
  //   var x = (ev.clientX - (canvas.height / 2)) / (canvas.height / 2);
  //   var y = ((canvas.height / 2) - ev.clientY) / (canvas.height / 2);
  //   var pixels = new Uint8Array(4);
  //   this.gl.readPixels(0, 0, 1, 1, this.gl.RGBA, this.gl.UNSIGNED_BYTE, pixels);
  //   console.log(pixels);
  // }

  clear() {
    location.reload();
  }

  keyUp(ev) {
    var keyName = event.key;
    if (keyName == "a" || keyName == "A" && _inputHandler.scene.geometries[0].id == "ship") {
      //left
      _inputHandler.scene.geometries[0].lrot = 0;
    }
    else if (keyName == "d" || keyName == "D" && _inputHandler.scene.geometries[0].id == "ship") {
      //right
      _inputHandler.scene.geometries[0].rrot = 0;
    }
    else if (keyName == "w" || keyName == "W" && _inputHandler.scene.geometries[0].id == "ship") {
      //up
      _inputHandler.scene.geometries[0].boost = 0;
    }
    else if (keyName == "s" && _inputHandler.scene.geometries[0].id == "ship") {
      //down
    }
    else if (keyName == " " && _inputHandler.scene.geometries[0].id == "ship") {
      this.shootReady = true;
    }

  }

  keyDown(ev) {
    var keyName = event.key;
    if (keyName == "a" || keyName == "A" && _inputHandler.scene.geometries[0].id == "ship") {
      //left
      _inputHandler.scene.geometries[0].lrot = 5;
    }
    else if (keyName == "d" || keyName == "D" && _inputHandler.scene.geometries[0].id == "ship") {
      //right
      _inputHandler.scene.geometries[0].rrot = -5;
    }
    else if (keyName == "w" || keyName == "W" && _inputHandler.scene.geometries[0].id == "ship") {
      //up
      _inputHandler.scene.geometries[0].boost = 1;
    }
    else if (keyName == "s" && _inputHandler.scene.geometries[0].id == "ship") {
      //down
    }
    else if (keyName == " " && _inputHandler.scene.geometries[0].id == "ship" && this.shootReady) {
      //space
      var pos = _inputHandler.scene.geometries[0].posVec;
      var dir = _inputHandler.scene.geometries[0].dirVec;
      var bullet = new Bullet(shader, pos, dir);
      _inputHandler.scene.addGeometry(bullet);
      var objs = [];
      for (var i = 0; i < this.scene.geometries.length; i++) {
        objs += _inputHandler.scene.geometries[i].id + "  ";
      }
      //console.log(objs);
      this.shootReady = false;
    }

  }


}

