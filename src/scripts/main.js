import Maze from './Maze.js';
import Player from './Player.js';
import * as Three from './three.min.js';

onresize = () => location.reload();

const ui = document.getElementById('ui');
const canvas = document.getElementById('main');
canvas.width = innerHeight * 4/3;
canvas.height = innerHeight;

const renderer = new Three.WebGLRenderer({ canvas, antialias: true });

const camera = new Three.PerspectiveCamera(90, 4/3, 0.075, 500);

const scene = new Three.Scene();

const maze = new Maze();

const finish = new Three.Mesh(
    new Three.BoxGeometry(
        maze.wallWidth * 3/4,
        maze.wallHeight,
        maze.wallWidth * 3/4
    ),
    new Three.MeshPhongMaterial({ color: 0x000000, emissive: 0x19bf2a})
);

finish.position.set(
    (maze.size - 0.5) * maze.wallWidth, 
    0,
    (maze.size - 0.5) * maze.wallWidth
);

const replayCam = new Three.OrthographicCamera(-maze.size/2, maze.size/2, maze.size/2, -maze.size/2, 0.075, 500);
replayCam.zoom = 0.2;
replayCam.position.set(0, maze.size * 10, 0);
replayCam.rotation.set(-Math.PI/2 + 0.15, Math.PI * 5/4, 0, 'YXZ');
replayCam.updateProjectionMatrix();

let replaying = false;

const player = new Player(camera, maze, finish);
player.position.set(1, 0, 1);

scene.add(maze);
scene.add(player);
scene.add(finish);

function render() {
    
    ui.innerHTML = `
        x: ${player.position.x.toFixed(2)}<br>
        y: ${player.position.y.toFixed(2)}<br>
        z: ${player.position.z.toFixed(2)}
        `;
        
    if(replaying && !player.replaying) {
        replaying = false;
        player.respawn();
        maze.regenerate();
    }

    if(!replaying && player.ray.intersectObject(finish).length) {
        replaying = true;
        player.respawn();
        player.replay();
    }

    player.render();
    
    if(replaying)
        renderer.render(scene, replayCam);
    else
        renderer.render(scene, camera);

    requestAnimationFrame(render);

}
requestAnimationFrame(render);

let keys = new Set();

onkeydown = e => {
    if(keys.has(e.code)) return;
    if(!keys.size) player.dir.set(0, 0, 0);
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
        case 'ShiftLeft':
            player.position.y += 0.5;
            return;
        case 'ShiftRight':
            player.position.y -= 0.5;
            return;
        default:
            return;
    }
    keys.add(e.code);
    player.start();
}

onkeyup = e => {
    if(keys.size != 1)
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