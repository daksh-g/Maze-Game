import { DoubleSide, Mesh, MeshPhongMaterial, Object3D, PlaneBufferGeometry } from './three.min.js';

export default class Maze extends Object3D {

    constructor() {
        super();
        this.n = 20;
        this.wallColor = 0x666699;
        this.wallWidth = 1.5;
        this.wallHeight = 1;
        this.grid = Array.from(Array(this.n), () => new Array(this.n).fill(0));
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

        this.generate(Math.random() * this.n | 0, Math.random() * this.n | 0);
        this.generateWalls();

        this.addEdge(this.n / 2, 0);
        this.addEdge(0, this.n / 2, true);
        this.addEdge(this.n / 2, this.n);
        this.addEdge(this.n, this.n / 2, true);

    }

    generate(x, y) {

        let dirs = ['N', 'S', 'E', 'W'];

        for(let i = 3; i; i--) {
            let j = Math.random() * (i + 1) | 0;
            [dirs[i], dirs[j]] = [dirs[j], dirs[i]];
        }

        for(const dir of dirs) {

            let nx = x + this.xdir[dir],
                ny = y + this.ydir[dir];
            
            if(nx < 0 || nx == this.n || ny < 0 || ny == this.n || this.grid[nx][ny])
                continue;
            
            this.grid[x][y] |= this.dirs[dir];
            this.grid[nx][ny] |= this.dirs[this.odir[dir]];

            this.generate(nx, ny);

        }

    }

    addEdge(x, y, rotated = false) {
        const edge = new Mesh(
            new PlaneBufferGeometry(this.n * this.wallWidth),
            new MeshPhongMaterial({ color: 0x000000, emissive: this.wallColor, side: DoubleSide})
        );
        edge.position.set(x * this.wallWidth, 0, y * this.wallWidth);
        if(rotated) edge.rotation.y = Math.PI/2;
        this.add(edge);
    }

    addWall(x, y, dx, dy, rotated = false) {
        const wall = new Mesh(
            new PlaneBufferGeometry(this.wallWidth, this.wallHeight),
            new MeshPhongMaterial({ color: 0x000000, emissive: this.wallColor, side: DoubleSide })
        );
        wall.position.set(
            (x + dx) * this.wallWidth,
            this.wallHeight / 4,
            (y + dy) * this.wallWidth
        );
        if(rotated) wall.rotation.y = Math.PI/2;
        this.add(wall);
    }

    generateWalls() {
        for(let i = 0; i < this.n; i++)
        for(let j = 0; j < this.n; j++) {

            const elem = this.grid[i][j];

            if(i != this.n - 1 && (elem & this.dirs.E) == 0)
                this.addWall(i + 1, j, 0, 0.5, true);

            if(j != this.n - 1 && (elem & this.dirs.S) == 0)
                this.addWall(i, j + 1, 0.5, 0);

        }
    }

}