/**
 * Specifies a triangle. A subclass of geometry.
 *
 * @author Connor Koch
 * @this {Square}
 */
class Square extends Geometry {
  /**
   * Constructor for Square.
   *
   * @constructor
   * @param {Shader} shader Shading object used to shade geometry
   * @returns {Square} Square created
   */
  constructor(shader, x, y, size, color) {
    super(shader);
    this.x = x - size;
    this.y = y - size;
    this.size = size;
    this.color = color;

    this.vertices = this.generateSquareVertices(x, y, size, color);
    this.faces = { 0: this.vertices };

    this.modelMatrix = new Matrix4();
    this.rotateMatrix = new Matrix4();

    this.shader.setUniform("u_ModelMatrix", this.modelMatrix.elements);
    // CALL THIS AT THE END OF ANY SHAPE CONSTRUCTOR
    this.interleaveVertices();
  }

  generateSquareVertices(x, y, size, color) {
    var vertices = []
    var vertex1 = new Vertex(x - size, y - size, 0.0, color);
    var vertex2 = new Vertex(x + size, y - size, 0.0, color);
    var vertex3 = new Vertex(x + size, y + size, 0.0, color);

    var vertex4 = new Vertex(x - size, y + size, 0.0, color);
    var vertex5 = new Vertex(x + size, y + size, 0.0, color);
    var vertex6 = new Vertex(x - size, y - size, 0.0, color);

    vertices.push(vertex1);
    vertices.push(vertex2);
    vertices.push(vertex3);
    vertices.push(vertex4);
    vertices.push(vertex5);
    vertices.push(vertex6);


    return vertices;
  }

  render() {
    this.shader.setUniform("u_ModelMatrix", this.modelMatrix.elements);
  }
}
