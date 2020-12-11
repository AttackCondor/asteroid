var shader = null;

function main() {
  // Retrieve the canvas from the HTML document
  canvas = document.getElementById("webgl");
  hud = document.getElementById("hud");

  // Retrieve WebGL rendering context
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log("Failed to get WebGL rendering context.");
    return;
  }

  var ctx = hud.getContext('2d');
  if (!ctx) {
    console.log("Failed to get WebGL rendering context. (hud)");
    //return;
  }
  //console.log(hud);

  // Initialize the scene
  var scene = new Scene();
  //var hudscene = new Scene();
  var inputHandler = new InputHandler(canvas, scene);


  var idMatrix = new Matrix4();
  // Initialize shaders
  shipshader = new Shader(gl, SHIP_VSHADER, SHIP_FSHADER);
  shader = new Shader(gl, REG_VSHADER, REG_FSHADER);

  // Add attibutes to REG shader
  shader.addAttribute("a_Position");
  shader.addAttribute("a_Color");
  shader.addUniform("u_ModelMatrix", "mat4", idMatrix.elements);

  // Add attibutes to SHIP shader
  shipshader.addAttribute("a_Position");
  shipshader.addAttribute("a_Color");
  shipshader.addUniform("u_ModelMatrix", "mat4", idMatrix.elements);
  shipshader.addUniform("u_Boost", "float", 1.0);
  //console.log(shipshader.uniforms);


  //Add geometries to init screen
  var ship = new Ship(shipshader);
  scene.addGeometry(ship);

  // Initialize renderer with scene and camera
  renderer = new Renderer(gl, scene, null, hud, ctx);
  renderer.start();

  hud.onmousedown = function(ev){
    var x = ev.clientX, y = ev.clientY;
    //console.log(x, y);
    //console.log(renderer.time);
    if(x>500 && x<580 && y>30 && y<60) location.reload();
    if(x>500 && x<580 && y>70 && y<100){
       if(renderer.pause == true) renderer.pause = false;
       else renderer.pause = true;
    }
    if(renderer.time == 1){
      renderer.pause = false;
      renderer.time += 1;
    }
  }  

}

