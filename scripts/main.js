import Maze from './Maze.js';
import Player from './Player.js';
import * as Three from './three.min.js';

onresize = () => location.reload();

const ui = document.getElementById('ui');
const canvas = document.getElementById('main');
canvas.width = innerHeight * 4/3;
canvas.height = innerHeight;

const renderer = new Three.WebGLRenderer({ canvas, antialias: true });

const camera = new Three.PerspectiveCamera(80, 4/3, 0.1, 1000);

const scene = new Three.Scene();

const player = new Player(camera);

const maze = new Maze();
maze.position.set(0, -20, 0);

scene.add(maze);
scene.add(player);

function render(time) {

    time *= 0.001;
    
    ui.innerHTML = `
        x: ${player.position.x.toFixed(2)}<br>
        y: ${player.position.y.toFixed(2)}<br>
        z: ${player.position.z.toFixed(2)}
    `;

    player.render();

    renderer.render(scene, camera);

    requestAnimationFrame(render);

}
requestAnimationFrame(render);

let keys = new Set();

onkeydown = e => {
    if(keys.has(e.code)) return;
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
    keys.add(e.code);
    player.start();
}

onkeyup = e => {
    switch(e.code) {
        case 'ArrowLeft':
        case 'KeyA':
            player.addDir(1, 0);
            break;
        case 'ArrowRight':
        case 'KeyD':
            player.addDir(-1, 0);
            break;
        case 'ArrowDown':
        case 'KeyS':
            player.addDir(0, 1);
            break;
        case 'ArrowUp':
        case 'KeyW':
            player.addDir(0, -1);
            break;
        default:
            return;
    }
    keys.delete(e.code);
    if(!keys.size) player.stop();
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