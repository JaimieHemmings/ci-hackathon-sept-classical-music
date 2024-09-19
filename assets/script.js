import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { MeshLine, MeshLineGeometry, MeshLineMaterial } from "./MeshLine/index.js";
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';
const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(55, w / h, 0.11, 1000);
camera.position.set(2, 1, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// Declare amplitude and frequency variables
const frequency = 0.1;
let amplitude = 1;
let waveLength = 0.1;

// Event listener to update amplitude based on mouse x position
window.addEventListener('mousemove', (event) => {
  const mouseY = event.clientY;
  const mouseX = event.clientX;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight

  // Get the mouses y position from the bottom of the window

  // Scale amplitude between 0 and 2
  amplitude = ((((mouseY + 1) - windowHeight) / windowHeight) * 2) / 5;
  // update wavelength based on mouse x position
  waveLength = (((mouseX + 2) / windowWidth) * 0.1);
  console.log(waveLength);
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
  const numPoints = 900;
  for (let j = 0; j < numPoints; j += 1) {
    let x = -7.5 + j * 0.05;
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
    lineWidth: 0.75,
    blending: THREE.AdditiveBlending,
  });

  const meshLine = new MeshLine(geometry, material);
  const offset = index * 50;
  meshLine.userData.update = function(t) {
    for (let p = 0, len = points.length; p < len; p += 3) {
      points[p + 1] = Math.sin((p - t + offset) * waveLength) * amplitude; // update y position only
    }
    geometry.setPoints(points, () => 1);
  };
  return meshLine;
}
const numLines = 15;
for (let i = 0; i < numLines; i += 1) {
  const line = getMeshLine(i);
  line.position.y = i * 0.1;
  line.position.z = i * -0.3;
  linesGroup.add(line);
}

camera.lookAt(scene.position);

function animate(t = 0) {
  requestAnimationFrame(animate);
  // Add a small amount of mvoement to the camera
  camera.position.x = Math.sin(t * 0.001) * 1;
  linesGroup.userData.update(t * frequency);
  composer.render(scene, camera);
  controls.update();
}

animate();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);