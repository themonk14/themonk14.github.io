// Basic Three.js Particle System
console.log("Initializing Particle System...");

let scene, camera, renderer, particles, particleSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Configuration for themes
const THEMES = {
    bw: {
        color: 0xffffff,
        background: 0x1a1a1a
    },
    gold: {
        color: 0xffd700,
        background: 0xffffff
    }
};

let currentTheme = 'bw';

function init() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    // SCENE
    scene = new THREE.Scene();
    // Default background (can be transparent to show CSS gradient, or set here)
    // scene.background = new THREE.Color(THEMES[currentTheme].background);

    // CAMERA
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    // RENDERER
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); // Alpha true for transparent background
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // PARTICLES
    const particleCount = 1800;
    particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    // Spread particles
    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() * 2 - 1) * 2000;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // MATERIAL
    const pMaterial = new THREE.PointsMaterial({
        color: THEMES[currentTheme].color,
        size: 3,
        sizeAttenuation: true
    });

    // SYSTEM
    particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    // LISTENERS
    document.addEventListener('mousemove', onDocumentMouseMove);
    document.addEventListener('wheel', onDocumentWheel);
    window.addEventListener('resize', onWindowResize);

    // Touch events for pinch
    document.addEventListener('touchstart', onTouchStart, { passive: false });
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);

    // Custom Event for Theme Toggle
    window.addEventListener('particle-theme-change', (e) => {
        if (e.detail && e.detail.theme && THEMES[e.detail.theme]) {
            currentTheme = e.detail.theme;
            particleSystem.material.color.setHex(THEMES[currentTheme].color);
            // Optionally change scene background if not using CSS
            // scene.background.setHex(THEMES[currentTheme].background); 
        }
    });

    animate();
}

// INTERACTION HANDLERS
function onDocumentMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 0.5;
    mouseY = (event.clientY - windowHalfY) * 0.5;
}

function onDocumentWheel(event) {
    // Zoom in/out based on scroll
    camera.position.z += event.deltaY * 0.5;
    // Clamp zoom
    if (camera.position.z < 100) camera.position.z = 100;
    if (camera.position.z > 2000) camera.position.z = 2000;
}

// TOUCH PINCH LOGIC
let initialPinchDistance = null;
let initialCameraZ = null;

function onTouchStart(event) {
    if (event.touches.length === 2) {
        const dx = event.touches[0].pageX - event.touches[1].pageX;
        const dy = event.touches[0].pageY - event.touches[1].pageY;
        initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
        initialCameraZ = camera.position.z;
    }
}

function onTouchMove(event) {
    if (event.touches.length === 2 && initialPinchDistance) {
        const dx = event.touches[0].pageX - event.touches[1].pageX;
        const dy = event.touches[0].pageY - event.touches[1].pageY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        // Calculate scale factor
        const scale = initialPinchDistance / currentDistance;

        // Apply to camera position (inverted because moving camera closer = zooming in)
        camera.position.z = initialCameraZ * scale;

        // Clamp
        if (camera.position.z < 100) camera.position.z = 100;
        if (camera.position.z > 2000) camera.position.z = 2000;

        event.preventDefault(); // Prevent default browser zoom
    }
}

function onTouchEnd() {
    initialPinchDistance = null;
    initialCameraZ = null;
}


function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);

    // Subtle rotation based on mouse
    particleSystem.rotation.x += 0.001;
    particleSystem.rotation.y += 0.001;

    // Chase mouse gently
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Start once DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
