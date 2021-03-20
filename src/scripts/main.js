import Player from './Player.js';
import * as Three from './three.min.js';

onresize = () => location.reload();

const canvas = document.getElementById('main');
canvas.width = innerHeight * 4/3;
canvas.height = innerHeight;

const renderer = new Three.WebGLRenderer({ canvas, antialias: true });

const far = 1000;
const camera = new Three.PerspectiveCamera(80, 4/3, 0.1, far);

const scene = new Three.Scene();

const light = new Three.DirectionalLight()
    , light2 = new Three.DirectionalLight();
light.position.set(-1, 2, 10);
light2.position.set(1, -2, -10);

const cube = new Three.Mesh(
    new Three.BoxBufferGeometry(1, 1, 1),
    new Three.MeshPhongMaterial({ color: 0x8c03fc })
);

const player = new Player(camera);

scene.add(light);
scene.add(light2);
scene.add(cube);
scene.add(player)

function render(time) {

    time *= 0.001;
    
    cube.rotation.x = time;
    cube.rotation.y = time;

    player.render();

    renderer.render(scene, camera);

    requestAnimationFrame(render);

}
requestAnimationFrame(render);

onkeydown = e => {
    switch(e.code) {
        case 'ArrowLeft':
        case 'KeyA':
            player.addDir(-1, 0);
            break;
        case 'ArrowRight':
        case 'KeyD':
            player.addDir(1, 0);
            break;
        case 'ArrowDown':
        case 'KeyS':
            player.addDir(0, -1);
            break;
        case 'ArrowUp':
        case 'KeyW':
            player.addDir(0, 1);
            break;
        default:
            return;
    }
    player.start();
}

onkeyup = e => {
    player.stop();
}

canvas.onclick = () => {
    canvas.requestPointerLock();
}

onmousemove = e => {
    if(document.pointerLockElement) {
        player.rotation.y -= e.movementX / 100;
        camera.rotation.x -= e.movementY / 100;
    }
}