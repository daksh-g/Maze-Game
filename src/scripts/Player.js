import { Object3D, Vector3 } from './three.min.js';

export default class Player extends Object3D {

    constructor(camera) {
        super();
        this.dir = new Vector3();
        this.maxSpeed = 0.3;
        this.speed = 0;
        this.camera = camera;

        this.add(camera);
    }
    
    render() {

        this.camera.rotation.x = Math.max(-Math.PI/2, Math.min(this.camera.rotation.x, Math.PI/2));

        const angle = Math.atan2(this.dir.z, this.dir.x) + this.rotation.y - Math.PI/2;
        const trueDir = new Vector3(-Math.sin(angle), 0, -Math.cos(angle));

        this.position.addScaledVector(trueDir, this.speed);

    }
    
    addDir(x, z) {
        this.dir.add(new Vector3(x, 0, z));
    }

    start() {
        this.speed = this.maxSpeed;
    }

    stop() {
        this.speed = 0;
        this.dir.set(0, 0, 0);
    }

}