/**
 * Specifies a Explosion. A subclass of geometry.
 *
 * @author Connor Koch
 * @this {Explosion}
 */
class Explosion extends Geometry {
    /**
     * Constructor for Square.
     *
     * @constructor
     * @param {Shader} shader Shading object used to shade geometry
     * @returns {Square} Square created
     */
    constructor(shader, x, y) {
        super(shader);

        this.id = "exp";
        this.x = x;
        this.y = y;

        this.posVec = new Vector3([x, y, 0]);

        this.vertices = this.generateExplosionVertices(0, 0);
        this.faces = { 0: [0, 1, 2] };

        this.modelMatrix = new Matrix4();
        this.rotationMatrix = new Matrix4();
        this.translationMatrix = new Matrix4();
        this.translationMatrix.setTranslate(x, y, 0);
        this.scalingMatrix = new Matrix4();
        this.scalingMatrix.setScale(1.001, 1.001, 0);
        this.originMatrix = new Matrix4();
        this.positionMatrix = new Matrix4();

        this.time = 0;

        this.time = 0;
        // CALL THIS AT THE END OF ANY SHAPE CONSTRUCTOR
        this.interleaveVertices();
    }

    generateExplosionVertices(x, y) {
        var vertices = []
        var size = .01;
        var segments = 6;
        var color = [255, 0, 0];
        var i = 0;
        for (i = 0; i < 360; i += (360 / segments)) {
            var seglen = 360 / segments;
            var angle1 = Math.PI * 2 * i / 360;
            var angle2 = Math.PI * 2 * (i + seglen) / 360;
            var vertex1 = new Vertex(x, y, 0.0, color);
            var vertex2 = new Vertex(x + (Math.sin(angle1) * size), y + (Math.cos(angle1) * size), 0.0, [0,0,0]);
            var vertex3 = new Vertex(x + (Math.sin(angle2) * size), y + (Math.cos(angle2) * size), 0.0, [0,0,0]);
            vertices.push(vertex1);
            vertices.push(vertex2);
            vertices.push(vertex3);
        }

        return vertices;
    }
    render() {
        this.time++;
        if (this.time < 10) {
            this.scalingMatrix.scale(1.3, 1.3, 0);
            this.modelMatrix = this.modelMatrix.multiply(this.translationMatrix);
            this.modelMatrix = this.modelMatrix.multiply(this.scalingMatrix);
            this.shader.setUniform("u_ModelMatrix", this.modelMatrix.elements);
            this.modelMatrix = new Matrix4();
        }
        if (this.time >= 10) {
            this.scalingMatrix.scale(.9, .9, 0);
            this.modelMatrix = this.modelMatrix.multiply(this.translationMatrix);
            this.modelMatrix = this.modelMatrix.multiply(this.scalingMatrix);
            this.shader.setUniform("u_ModelMatrix", this.modelMatrix.elements);
            this.modelMatrix = new Matrix4();
        }
    }
}
