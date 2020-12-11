/**
 * Specifies a vertex. Currently only contains the vertex's position.
 *
 * @author Lucas N. Ferreira
 * @this {Vertex}
 */
class Vertex {
  constructor(x, y, z, col) {
      this.point    = new Vector3([x, y, z]);
      if(col) this.color = [col[0]/255, col[1]/255, col[2]/255, 1.0];
      else this.color = [Math.random(), Math.random(), Math.random()];
      this.texCoord = [0.0, 0.0];

      // This class can be extended to support other attributes such as
      // normals and UV coordinates.
  }
}
