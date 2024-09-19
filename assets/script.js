import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { MeshLine, MeshLineGeometry, MeshLineMaterial } from "./MeshLine/index.js";
import { UnrealBloomPass } from 'jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'jsm/postprocessing/RenderPass.js';

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const textLoader = new THREE.FontLoader();
const points = [];
const numPoints = 300;
for (let j =0; j < numPoints; j++) {
  let x = -7.5 + j * 0.05;
  points.push(x, y, 0);
}
const geometry = new MeshLineGeometry();
geometry.setPoints(points);