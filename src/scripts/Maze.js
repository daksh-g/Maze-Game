import { DoubleSide, Mesh, MeshPhongMaterial, Object3D, PlaneGeometry } from './three.min.js';

export default class Maze extends Object3D {

    constructor() {
        super();
        this.size = 10;
        this.wallColor = 0x666699;
        this.wallWidth = 2;
        this.wallHeight = 1;
        this.grid = Array.from(Array(this.size), () => Array(this.size).fill(0));
        this.dirs = {
            N: 1,
            S: 2,
            E: 4,
            W: 8
        };
        this.xdir = {
            N: 0,
            S: 0,
            E: 1,
            W: -1
        };
        this.ydir = {
            N: -1,
            S: 1,
            E: 0,
            W: 0
        };
        this.odir = {
            N: 'S',
            S: 'N',
            E: 'W',
            W: 'E'
        };

        this.generate();
        this.generateWalls();

    }

    generate(x = Math.random() * this.size | 0, y = Math.random() * this.size | 0) {

        let dirs = ['N', 'S', 'E', 'W'];

        for(let i = 3; i; i--) {
            let j = Math.random() * (i + 1) | 0;
            [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
        }

        for(const dir of dirs) {

            let nx = x + this.xdir[dir],
                ny = y + this.ydir[dir];
            
            if(nx < 0 || nx == this.size || ny < 0 || ny == this.size || this.grid[nx][ny])
                continue;
       
            this.grid[x][y] |= this.dirs[dir];
            this.grid[nx][ny] |= this.dirs[this.odir[dir]];

            this.generate(nx, ny);

        }

    }

    addEdge(x, y, rotated = false) {
        const edge = new Mesh(
            new PlaneGeometry(this.size * this.wallWidth),
            new MeshPhongMaterial({ color: 0x000000, emissive: this.wallColor, side: DoubleSide})
        );
        edge.position.set(x * this.wallWidth, 0, y * this.wallWidth);
        if(rotated) edge.rotation.y = Math.PI/2;
        this.add(edge);
    }

    addWall(x, y, dx, dy, rotated = false) {
        const wall = new Mesh(
            new PlaneGeometry(this.wallWidth, this.wallHeight),
            new MeshPhongMaterial({ color: 0x000000, emissive: this.wallColor, side: DoubleSide })
        );
        wall.position.set(
            (x + dx) * this.wallWidth,
            0,
            (y + dy) * this.wallWidth
        );
        if(rotated) wall.rotation.y = Math.PI/2;
        this.add(wall);
    }

    generateWalls() {
        for(let i = 0; i < this.size; i++)
        for(let j = 0; j < this.size; j++) {

            const elem = this.grid[i][j];

            if(i != this.size - 1 && (elem & this.dirs.E) == 0)
                this.addWall(i + 1, j, 0, 0.5, true);

            if(j != this.size - 1 && (elem & this.dirs.S) == 0)
                this.addWall(i, j + 1, 0.5, 0);

        }

        this.addEdge(this.size / 2, 0);
        this.addEdge(0, this.size / 2, true);
        this.addEdge(this.size / 2, this.size);
        this.addEdge(this.size, this.size / 2, true);
    }

    regenerate() {
        this.children = [];
        this.grid = Array.from(Array(this.size), () => Array(this.size).fill(0));
        this.generate();
        this.generateWalls();
    }

}