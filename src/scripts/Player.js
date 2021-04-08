import { Object3D, Raycaster, Vector3 } from './three.min.js';

export default class Player extends Object3D {

    constructor(camera, maze) {
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
            0.25
        );
        this.camera = camera;
        this.maze = maze;

        this.add(camera);
    }
    
    render() {

        this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(this.camera.rotation.x, Math.PI/2));

        const angle = Math.atan2(this.dir.z, this.dir.x) + this.rotation.y - Math.PI/2;
        this.trueDir.set(-Math.sin(angle), 0, -Math.cos(angle));

        const objs = this.ray.intersectObject(this.maze, true);
        if(objs.length)
            this.speed = 0;

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

}