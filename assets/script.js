import * as THREE from "three";
import { MeshLine, MeshLineGeometry, MeshLineMaterial } from "./MeshLine/index.js";
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
// Add a light to the scene
const camera = new THREE.PerspectiveCamera(50, w / h, 0.11, 1000);

let mouseDown = false;

// Event listener to check for mouse down
window.addEventListener('mousedown', (e) => {
  mouseDown = true;
});

// Event listener to check for mouse up
window.addEventListener('mouseup', (e) => {
  mouseDown = false;
});

// Event listener to check for touch start
window.addEventListener('touchstart', (e) => {
  mouseDown = true;
});

// Event listener to check for touch end
window.addEventListener('touchend', (e) => {
  mouseDown = false;
});

// Set Camera position
// Parameters are x = left and right, y = up and down, z = forward and backward
camera.position.set(0, 10, 3);

// Set camera rotation looking 5 degrees to the right
camera.rotation.x = -50 * Math.PI / 180;
camera.rotation.y = -25 * Math.PI / 180;
camera.rotation.z = Math.PI / 180;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// Declare amplitude and frequency variables
const frequency = 0.1;
let amplitude = 1;
let waveLength = 0.1;


function moveEvent (e) {
  let mouseY;
  let mouseX;

  if(e.type == 'touchmove'){
    mouseY = e.touches[0].clientY;
    mouseX = e.touches[0].clientX;
  }
  else if(e.type == 'mousemove'){
    mouseY = e.clientY;
    mouseX = e.clientX;
  }

  // Get the mouses y position from the bottom of the window

  // Scale amplitude between 0 and 2
  amplitude = ((((mouseY + 1) - h) / w) * 2) / 5;
  // update wavelength based on mouse x position
  waveLength = ((mouseX / w) * 0.1) / 2;
}

// Event listener to update amplitude based on mouse x position
window.addEventListener('mousemove', (e) => {
  moveEvent(e);
});

// Event listener for touch move event to update frequency and volume
window.addEventListener('touchmove', (e) => {
  moveEvent(e);
});

// bloom UnrealBloomPass
// https://threejs.org/examples/webgl_postprocessing_unreal_bloom.html
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(w, h), 1.5, 0.4, 0.85);
bloomPass.threshold = 0.1;
bloomPass.strength = 0.15;
bloomPass.radius = 1.25;
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const texLoader = new THREE.TextureLoader();

const linesGroup = new THREE.Group();
linesGroup.userData.update = function (t) {
  linesGroup.children.forEach((line) => line.userData.update(t));
}
scene.add(linesGroup);

/**
 * Creates a MeshLine with animated points.
 * @param {number} index - The index of the line.
 * @returns {MeshLine} - The created MeshLine.
 */
function getMeshLine(index) {
  const points = [];
  const numPoints = 400;
  for (let j = 0; j < numPoints; j += 1) {
    let x = -7.5 + j * 0.1;
    let y = Math.sin(j * 0.075);
    points.push(x, y, 0);
  }
  const geometry = new MeshLineGeometry();
  geometry.setPoints(points);
  const hue = 0.75 - index * 0.02;
  const lightness = 0.5 - index * 0.02;
  const color = new THREE.Color().setHSL(hue, 1.0, lightness);
  const material = new MeshLineMaterial({
    color,
    map: texLoader.load("./assets/strokes/stroke.png"),
    useMap: true,
    alphaTest: 0.1,
    transparent: true,
    resolution: new THREE.Vector2(w, h),
    lineWidth: 0.4,
    blending: THREE.AdditiveBlending,
  });

  const meshLine = new MeshLine(geometry, material);
  const offset = index * 200;
  meshLine.userData.update = function(t) {
    for (let p = 0, len = points.length; p < len; p += 3) {
      if (mouseDown) {
        points[p + 1] = Math.sin((p - t + offset * 2) * waveLength ) * (amplitude / 2);
      } else {
        points[p + 1] = 0;
      }
    }
    geometry.setPoints(points, () => 1);
  };
  return meshLine;
}
const numLines = 30;
for (let i = 0; i < numLines; i += 1) {
  const line = getMeshLine(i);
  line.position.y = i * 0.1;
  line.position.z = i * -0.3;
  linesGroup.add(line);
}

function animate(t = 0) {
  requestAnimationFrame(animate);
  // add a small rotation to the camera
  camera.rotation.z = Math.sin(t * 0.001) * 0.1;
  camera.position.x = Math.sin(t * 0.001) * 0.1;
  
  linesGroup.userData.update(t * frequency);
  composer.render(scene, camera);
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);