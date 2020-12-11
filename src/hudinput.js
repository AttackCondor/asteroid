var _inputHandler = null;

/**
 * Specifies a Input Handler. Used to parse input events from a HTML page.
 *
 * @author Lucas N. Ferreira
 * @this {Scene}
 */
class HUDInputHandler {
  /**
   * Initializes the event handeling functions within the program.
   */
  constructor(canvas, scene) {
    this.canvas = canvas;
    this.scene = scene;

    _inputHandler = this;

    this.image = null;

    // Mouse Events
    this.canvas.onmousedown = function (ev) { this.mouseheld = true; _inputHandler.click(ev); };
    this.canvas.onmouseup = function () { this.mouseheld = false; };
    this.canvas.onmousemove = function (ev) { if (this.mouseheld) { _inputHandler.click(ev) } };

  }

  /**
   * Function called upon mouse click.
   */
  click(ev) {
    // Print x,y coordinates.
    console.log(ev.clientX, ev.clientY);
    //Convert coordinates to webgl style
    var x = (ev.clientX - (canvas.height / 2)) / (canvas.height / 2);
    var y = ((canvas.height / 2) - ev.clientY) / (canvas.height / 2);
  }


}

