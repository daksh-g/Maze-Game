import { Object3D, PointLight, Raycaster, Vector3 } from './three.min.js';

export default class Player extends Object3D {

    constructor(camera, maze, finish) {
        super();
        this.dir = new Vector3();
        this.trueDir = new Vector3();
        this.maxSpeed = 0.1;
        this.speed = 0;
        this.stopped = true;
        this.ray = new Raycaster(
            this.position,
            this.trueDir,
            0,
            0.4
        );

        this.camera = camera;
        this.maze = maze;
        this.finish = finish;

        this.light = new PointLight(0xffffff, 1);
        this.light.position.setY(2);
        this.rotation.y = Math.PI * 5/4;

        this.add(camera);
        this.add(this.light);
    }
    
    render() {

        this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(this.camera.rotation.x, Math.PI/2));

        const angle = Math.atan2(this.dir.z, this.dir.x) + this.rotation.y - Math.PI/2;
        this.trueDir.set(-Math.sin(angle), 0, -Math.cos(angle));

        let objs = this.ray.intersectObject(this.maze);
        if(objs.length)
            this.speed = 0;

        objs = this.ray.intersectObject(this.finish);
        if(objs.length) {
            this.maze.regenerate();
            this.respawn();
        }

        if(this.stopped)
            this.speed *= 0.85;

        this.position.addScaledVector(this.trueDir, this.speed);

    }
    
    addDir(x, z) {
        this.dir.add(new Vector3(x, 0, z));
    }

    start() {
        this.speed = this.maxSpeed;
        this.stopped = false;
    }

    stop() {
        this.stopped = true;
    }

    respawn() {
        this.position.set(1, 0, 1);
        this.rotation.y = Math.PI * 5/4;
    }

}