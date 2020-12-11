/**
 *
 * @author Connor Koch
 * @this {ship}
 */
class Ship extends Geometry {
  /**
   * Constructor for Ship
   *
   * @constructor
   * @param {Shader} shader Shading object used to shade geometry
   * @returns {ship} ship created
   */
  constructor(shader) {
    super(shader);
    this.id = "ship";
    this.xMom = 0;
    this.yMom = 0;
    this.boost = 0;
    this.color = [0, 255, 0];
    this.lrot = 0;
    this.rrot = 0;
    this.dirVec = new Vector3([0, 1, 0]);
    this.posVec = new Vector3([0, 0, 0]);
    this.rotMatrix = new Matrix4();
    this.transMatrix = new Matrix4();
    this.modelMatrix = new Matrix4();
    this.time = 0;

    this.vertices = this.generateShipVertices();
    this.faces = { 0: this.vertices };


    // CALL THIS AT THE END OF ANY SHAPE CONSTRUCTOR
    this.interleaveVertices();
  }

  generateShipVertices() {
    var vertices = []

    var thrusterColor = [255, 255, 0];
    //Left side
    var vertex0 = new Vertex(this.posVec.elements[0], this.posVec.elements[1], 0, [0, 0, 0]); //center
    var vertex1 = new Vertex(this.posVec.elements[0] - .04, this.posVec.elements[1] - .04, 0, this.color); //left bottom
    var vertex2 = new Vertex(this.posVec.elements[0], this.posVec.elements[1] + .08, 0, this.color);  //front

    //Right side
    var vertex3 = new Vertex(this.posVec.elements[0], this.posVec.elements[1], 0, [0, 0, 0]); //center
    var vertex4 = new Vertex(this.posVec.elements[0] + .04, this.posVec.elements[1] - .04, 0, this.color); //right bottom
    var vertex5 = new Vertex(this.posVec.elements[0], this.posVec.elements[1] + .08, 0, this.color); //front

    //Bot side
    var vertex6 = new Vertex(this.posVec.elements[0], this.posVec.elements[1], 0, [0, 0, 0]); //center
    var vertex7 = new Vertex(this.posVec.elements[0] - .04, this.posVec.elements[1] - .04, 0, this.color); //left bottom
    var vertex8 = new Vertex(this.posVec.elements[0] + .04, this.posVec.elements[1] - .04, 0, this.color); //right bottom

    //thruster
    var vertex9 = new Vertex(this.posVec.elements[0], this.posVec.elements[1] - .1, 0, [0, 0, 0]); //center
    var vertex10 = new Vertex(this.posVec.elements[0] - .02, this.posVec.elements[1] - .04, 0, thrusterColor); //left bottom
    var vertex11 = new Vertex(this.posVec.elements[0] + .02, this.posVec.elements[1] - .04, 0, thrusterColor); //right bottom



    vertices.push(vertex0);
    vertices.push(vertex1);
    vertices.push(vertex2);
    vertices.push(vertex3);
    vertices.push(vertex4);
    vertices.push(vertex5);
    vertices.push(vertex6);
    vertices.push(vertex7);
    vertices.push(vertex8);
    vertices.push(vertex9);
    vertices.push(vertex10);
    vertices.push(vertex11);

    return vertices;
  }

  render() {
    this.time++;
    var boosting = false;
    //Set the rotation matrix to the desired rotation
    this.rotMatrix.multiply(new Matrix4().setRotate(this.lrot + this.rrot, 0, 0, 1));

    //Set the direction vector equal to the forward direction of the ship after rotating
    this.dirVec = this.rotMatrix.multiplyVector3(new Vector3([0, 1, 0]));
    this.dirVec.normalize();
    var boosting = 0;
    if (this.boost == 1) {
      this.shader.setUniform("u_ModelMatrix", 1.0);      // console.log("boosting");
      // console.log(this.shader.uniforms);
      this.xMom += this.dirVec.elements[0] * .001;
      this.yMom += this.dirVec.elements[1] * .001;
      if (this.xMom < -.03) this.xMom = -.025;
      if (this.xMom > .03) this.xMom = .025;
      if (this.yMom < -.03) this.yMom = -.025;
      if (this.yMom > .03) this.yMom = .025;
    }
    else {
      this.shader.setUniform("u_ModelMatrix", 0.0);
      if (this.xMom > 0) this.xMom -= .0003;
      else if (this.xMom < 0) this.xMom += .0003;
      if (this.yMom > 0) this.yMom -= .0003;
      else if (this.yMom < 0) this.yMom += .0003;
    }

    //Set the translation matrix equal to the x momentum and y momentum
    this.transMatrix.multiply(new Matrix4().setTranslate(this.xMom, this.yMom, 0));
    this.posVec = this.transMatrix.multiplyVector3(new Vector3([0, 0, 0]));

    //Bound checking
    if (this.posVec.elements[0] > 1) {
      this.transMatrix.multiply(new Matrix4().setTranslate(-2, 0, 0));
    }
    if (this.posVec.elements[0] < -1) {
      this.transMatrix.multiply(new Matrix4().setTranslate(2, 0, 0));
    }
    if (this.posVec.elements[1] > 1) {
      this.transMatrix.multiply(new Matrix4().setTranslate(0, -2, 0));
    }
    if (this.posVec.elements[1] < -1) {
      this.transMatrix.multiply(new Matrix4().setTranslate(0, 2, 0));
    }


    //Factor these matrices into the model matrix
    this.modelMatrix.multiply(this.transMatrix);
    this.modelMatrix.multiply(this.rotMatrix);
    this.shader.setUniform("u_ModelMatrix", this.modelMatrix.elements);
    this.modelMatrix = new Matrix4();
  }
}
