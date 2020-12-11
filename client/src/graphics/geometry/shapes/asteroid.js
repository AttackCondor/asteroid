/**
 * Specifies an asteroid. A subclass of geometry.
 *
 * @author Connor Koch
 * @this {Asteroid}
 */
class Asteroid extends Geometry {
    /**
     * Constructor for Square.
     *
     * @constructor
     * @param {Shader} shader Shading object used to shade geometry
     * @returns {Asteroid} Square created
     */
    constructor(shader, size, x, y) {
        super(shader);

        this.id = "ast";
        this.x = x;
        this.y = y;
        this.posVec = new Vector3([0, 0, 0]);
        this.size = size;
        this.segments = 8;
        this.xmov = ((Math.random() * 2) - 1) / 100;
        this.ymov = ((Math.random() * 2) - 1) / 100;

        this.vertices = this.generateAsteroidVertices(size, this.segments);
        this.faces = { 0: [0, 1, 2] };

        this.modelMatrix = new Matrix4().setTranslate(this.x, this.y, 0);
        this.rotationMatrix = new Matrix4();
        this.translationMatrix = new Matrix4();

        this.translationMatrix.setTranslate(this.xmov, this.ymov, 0);
        this.time = 0;
        // CALL THIS AT THE END OF ANY SHAPE CONSTRUCTOR
        this.interleaveVertices();
    }

    generateAsteroidVertices(size, segments) {
        var x = 0;
        var y = 0;
        var vertices = []
        var i = 0;
        for (i = 0; i < 360; i += (360 / segments)) {
            var insideCol = Math.random()*255;
            var seglen = 360 / segments;
            var angle1 = Math.PI * 2 * i / 360
            var angle2 = Math.PI * 2 * (i + seglen) / 360
            var vertex1 = new Vertex(x, y, 0.0, [0, 0, 0]);
            //var vertex1 = new Vertex(x, y, 0.0, [insideCol, insideCol, insideCol]); //for a different style
            var vertex2 = new Vertex(x + (Math.sin(angle1) * size), y + (Math.cos(angle1) * size), 0.0, [192, 192, 192]);
            var vertex3 = new Vertex(x + (Math.sin(angle2) * size), y + (Math.cos(angle2) * size), 0.0, [192, 192, 192]);
            vertices.push(vertex1);
            vertices.push(vertex2);
            vertices.push(vertex3);
        }

        return vertices;
    }
    render() {
        this.time++;
        this.modelMatrix.multiply(this.translationMatrix);
        this.posVec = this.modelMatrix.multiplyVector3(new Vector3([0, 0, 0]));
        //Bound checking
        if (this.posVec.elements[0] > 1.2) {
            this.modelMatrix.multiply(new Matrix4().setTranslate(-2.4, 0, 0));
        }
        if (this.posVec.elements[0] < -1.2) {
            this.modelMatrix.multiply(new Matrix4().setTranslate(2.4, 0, 0));
        }
        if (this.posVec.elements[1] > 1.2) {
            this.modelMatrix.multiply(new Matrix4().setTranslate(0, -2.4, 0));
        }
        if (this.posVec.elements[1] < -1.2) {
            this.modelMatrix.multiply(new Matrix4().setTranslate(0, 2.4, 0));
        }
        this.shader.setUniform("u_ModelMatrix", this.modelMatrix.elements);
    }
}
