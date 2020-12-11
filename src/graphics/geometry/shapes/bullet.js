/**
 *
 * @author Connor Koch
 * @this {Bullet}
 */
class Bullet extends Geometry {
  /**
   * Constructor for Bullet
   *
   * @constructor
   * @param {Shader} shader Shading object used to shade geometry
   * @returns {Bullet} Bullet created
   */
  constructor(shader, pos, dir) {
    super(shader);
    this.id = "bullet";
    this.xMom = pos.elements[0];
    this.yMom = pos.elements[1];
    this.color = [255, 0, 0];
    this.dirVec = dir;
    this.posVec = pos;
    this.transMatrix = new Matrix4();
    this.transMatrix.setTranslate(pos.elements[0], pos.elements[1], 0);
    this.modelMatrix = new Matrix4();
    this.time = 0;

    this.vertices = this.generateBulletVertices();
    this.faces = { 0: this.vertices };

    // CALL THIS AT THE END OF ANY SHAPE CONSTRUCTOR
    this.interleaveVertices();
  }

  generateBulletVertices() {
    var vertices = []
    var x = 0;
    var y = 0;
    var segments = 5;
    var size = .01;
    var i = 0;
        for (i = 0; i < 360; i += (360 / segments)) {
            var insideCol = Math.random()*255;
            var seglen = 360 / segments;
            var angle1 = Math.PI * 2 * i / 360
            var angle2 = Math.PI * 2 * (i + seglen) / 360
            var vertex1 = new Vertex(x, y, 0.0, this.color);
            //var vertex1 = new Vertex(x, y, 0.0, [insideCol, insideCol, insideCol]); //for a different style
            var vertex2 = new Vertex(x + (Math.sin(angle1) * size), y + (Math.cos(angle1) * size), 0.0, this.color);
            var vertex3 = new Vertex(x + (Math.sin(angle2) * size), y + (Math.cos(angle2) * size), 0.0, this.color);
            vertices.push(vertex1);
            vertices.push(vertex2);
            vertices.push(vertex3);
        }

    return vertices;
  }

  render() {
    if (this.time = 0) {
      this.xMom += this.dirVec.elements[0] * .1;
      this.yMom += this.dirVec.elements[1] * .1;
    }
    
    //Set the rotation matrix to the desired rotation
    this.time++;
    this.xMom += this.dirVec.elements[0] * .03;
    this.yMom += this.dirVec.elements[1] * .03;

    //Set the translation matrix equal to the x momentum and y momentum
    this.transMatrix.setTranslate(this.xMom, this.yMom, 0);
    this.posVec = new Vector3([this.xMom,this.yMom,0]);

    //Bound checking
    if (this.posVec.elements[0] > 1) {
      this.time = 40;
    }
    if (this.posVec.elements[0] < -1) {
      this.time = 40;
    }
    if (this.posVec.elements[1] > 1) {
      this.time = 40;
    }
    if (this.posVec.elements[1] < -1) {
      this.time = 40;
    }

    //Factor these matrices into the model matrix
    this.modelMatrix.multiply(this.transMatrix);
    this.shader.setUniform("u_ModelMatrix", this.modelMatrix.elements);
    this.modelMatrix = new Matrix4();
  }
}
