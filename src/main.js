import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load Skybox Textures
const loader = new THREE.CubeTextureLoader();
scene.background = loader.load([
    '/public/dispair-ridge_front.png',
    '/public/dispair-ridge_back.png',
    '/public/dispair-ridge_up.png',
    '/public/dispair-ridge_down.png',
    '/public/dispair-ridge_right.png',
    '/public/dispair-ridge_left.png',
]);

const light = new THREE.PointLight(0xffffff, 300, 50);
light.position.set(-5, 5, 5);
scene.add(light);

// Texture Loader
const textureLoader = new THREE.TextureLoader();
const planetTextures = {
    Mercury: textureLoader.load('/public/mercurymap.jpg'),
    Venus: textureLoader.load('/public/venusmap.jpg'),
    Earth: textureLoader.load('/public/earthmap.jpg'),
    Mars: textureLoader.load('/public/marsmap.jpg'),
    Jupiter: textureLoader.load('/public/jupitermap.jpg'),
    Saturn: textureLoader.load('/public/saturnmap.jpg'),
    Uranus: textureLoader.load('/public/uranusmap.jpg'),
    Neptune: textureLoader.load('/public/neptunemap.jpg')
};

// Create Planets with Orbits
const planets = [];
const planetData = [
    { name: 'Mercury', size: 1, distance: 9, speed: 0.04 }, 
    { name: 'Venus', size: 1.4, distance: 11, speed: 0.02 }, 
    { name: 'Earth', size: 1.5, distance: 13, speed: 0.015 },
    { name: 'Mars', size: 1.2, distance: 15, speed: 0.01 }, 
    { name: 'Jupiter', size: 2.5, distance: 19, speed: 0.005 },
    { name: 'Saturn', size: 2.2, distance: 23, speed: 0.004 }, 
    { name: 'Uranus', size: 1.9, distance: 27, speed: 0.003 }, 
    { name: 'Neptune', size: 1.9, distance: 31, speed: 0.002 } 
];

// Create Planets & Add to Scene
planetData.forEach(data => {
    const geometry = new THREE.SphereGeometry(data.size, 32, 32);
    const material = new THREE.MeshStandardMaterial({ map: planetTextures[data.name] });
    const planet = new THREE.Mesh(geometry, material);

    // Set initial position
    planet.position.x = data.distance;
    scene.add(planet);

    planets.push({
        mesh: planet,
        distance: data.distance,
        speed: data.speed,
        angle: Math.random() * Math.PI * 2 // Start at a random angle
    });
});

// Add Saturn Rings
const saturnRingGeometry = new THREE.RingGeometry(2.4, 3.2, 64); // Adjusted size to fit Saturn
const saturnRingMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load('/public/saturnringcolor.jpg'),
    side: THREE.DoubleSide,
    transparent: true
});
const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
saturnRing.rotation.x = Math.PI / 2;
scene.add(saturnRing);

// Add Uranus Rings
const uranusRingGeometry = new THREE.RingGeometry(2.0, 2.6, 64); // Adjusted size to fit Uranus
const uranusRingMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load('/public/uranusringcolour.jpg'),
    side: THREE.DoubleSide,
    transparent: true
});
const uranusRing = new THREE.Mesh(uranusRingGeometry, uranusRingMaterial);
uranusRing.rotation.x = Math.PI / 2.5;
scene.add(uranusRing);

// Create Monolith (Tall Rectangular Block)
const monolithGeometry = new THREE.BoxGeometry(4, 8, 4); // Increased size
const monolithMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
const monolith = new THREE.Mesh(monolithGeometry, monolithMaterial);
monolith.position.set(0, 1, 0); // Adjusted position to match larger size
scene.add(monolith);

// Orbit Controls for Camera
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 5;
controls.maxDistance = 50;
controls.maxPolarAngle = Math.PI; // Allow full vertical rotation

// Set Initial Camera Position
camera.position.set(0, 20, 40); // Adjusted position to better view larger objects
camera.lookAt(0, 0, 0);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate Planets Around Sun
    planets.forEach(planet => {
        planet.angle += planet.speed; // Increment angle
        planet.mesh.position.x = Math.cos(planet.angle) * planet.distance;
        planet.mesh.position.z = Math.sin(planet.angle) * planet.distance;
    });

    // Position Rings Around Their Planets
    saturnRing.position.copy(planets[5].mesh.position);
    uranusRing.position.copy(planets[6].mesh.position);

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Responsive Window Resize
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});