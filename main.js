// Cup configuration constants
const CUP_CONFIG = {
    TOP_RADIUS: 0.4,
    BOTTOM_RADIUS: 0.35,
    HEIGHT: 1.2,
    SEGMENTS: 64,
    RIM_RADIUS: 0.4,
    RIM_TUBE_RADIUS: 0.02,
    LID_TOP_RADIUS: 0.42,
    LID_BOTTOM_RADIUS: 0.41,
    LID_HEIGHT: 0.1,
    SLEEVE_TOP_RADIUS: 0.405,
    SLEEVE_BOTTOM_RADIUS: 0.375,
    SLEEVE_HEIGHT: 0.4,
    OPENING_RADIUS: 0.08,
    OPENING_HEIGHT: 0.12
};

// Menu data for specialty drinks
const menuData = {
  "call-the-cops": {
    "name": "I'm Gonna Call the Cops",
    "description": "Velvety espresso with detoxifying charcoal and creamy oat milk, finished with edible gold drama.",
    "cupColor": "#722F37",
    "steamColor": "#E8A317",
    "ingredients": [
      { "name": "Espresso", "volume": 120, "color": "#4B2E2B" },
      { "name": "Oat Milk", "volume": 240, "color": "#F5F5DC" },
      { "name": "Sea Moss Gel", "volume": 15, "color": "#D2B48C" },
      { "name": "Activated Charcoal", "volume": 5, "color": "#000000" },
      { "name": "Coconut Nectar", "volume": 5, "color": "#A67B5B" },
      { "name": "Pink Salt", "volume": 1, "color": "#FFB6C1" }
    ]
  },
  "wendys": {
    "name": "Ma'am/Sir, This Is a Wendy's",
    "description": "Lavender-infused cold brew shaken with vanilla cashew milk and adaptogenic calm.",
    "cupColor": "#722F37",
    "steamColor": "#C5A3FF",
    "ingredients": [
      { "name": "Lavender Cold Brew", "volume": 120, "color": "#4B3B6B" },
      { "name": "Vanilla Cashew Milk", "volume": 120, "color": "#F3E5AB" },
      { "name": "Sea Moss Gel", "volume": 15, "color": "#D2B48C" },
      { "name": "Adaptogen Powder", "volume": 5, "color": "#C4A484" },
      { "name": "Maple Syrup", "volume": 5, "color": "#8B4513" }
    ]
  },
  "kill-myself": {
    "name": "I'm Gonna Kill Myself (No Don't, You're So Hot)",
    "description": "Ceremonial matcha meets sparkling rosemary tonic with a rosy, spirulina-green twist.",
    "cupColor": "#722F37",
    "steamColor": "#87CEEB",
    "ingredients": [
      { "name": "Matcha Base", "volume": 240, "color": "#7CFC00" },
      { "name": "Almond Milk", "volume": 120, "color": "#F5DEB3" },
      { "name": "Rosemary Tonic", "volume": 120, "color": "#ADD8E6" },
      { "name": "Sea Moss Gel", "volume": 15, "color": "#D2B48C" },
      { "name": "Rosewater", "volume": 5, "color": "#FFC0CB" },
      { "name": "Spirulina", "volume": 2.5, "color": "#00FF7F" }
    ]
  }
};

let scene, camera, renderer, controls;
let currentCup = null;
let activeMenuItem = null;
let stars = null;
let starSizes = null;

// Initialize Three.js scene
function initThreeScene() {
    const container = document.getElementById('coffeeViewer');
    
    if (!container) {
        console.error('Coffee viewer container not found');
        return;
    }
    
    console.log('Initializing Three.js scene');
    
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    
    // Camera setup
    const width = container.clientWidth || 350;
    const height = container.clientHeight || 350;
    
    camera = new THREE.PerspectiveCamera(
        45,
        width / height,
        0.1,
        1000
    );
    camera.position.set(0, 2, 5);
    camera.lookAt(0, 0, 0);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Clear container and add canvas
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    console.log('Renderer created, size:', width, 'x', height);
    console.log('Canvas element:', renderer.domElement);
    
    // Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.enableZoom = true;
        controls.enableRotate = true;
        controls.enablePan = false;
        controls.rotateSpeed = 0.5;
        controls.minDistance = 2;
        controls.maxDistance = 8;
        controls.target.set(0, 0, 0);
        
        // Enable controls
        controls.enabled = true;
        controls.update();
        
        console.log('OrbitControls initialized successfully');
    } else {
        console.warn('OrbitControls not loaded - 3D viewer will be static');
        // Set fallback camera position for better default view
        camera.position.set(2, 1, 3);
        camera.lookAt(0, 0, 0);
    }
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 20;
    directionalLight.shadow.camera.left = -5;
    directionalLight.shadow.camera.right = 5;
    directionalLight.shadow.camera.top = 5;
    directionalLight.shadow.camera.bottom = -5;
    scene.add(directionalLight);
    
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.5);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);
    
    const pointLight = new THREE.PointLight(0xE8A317, 0.3, 10);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);
    
    // Create starry background
    createStarryBackground();
    
    // Handle resize
    window.addEventListener('resize', onWindowResize);
    
    console.log('Three.js scene initialized successfully');
}

// Create starry background
function createStarryBackground() {
    const starsGeometry = new THREE.BufferGeometry();
    // Reduce star count on mobile devices for better performance
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const starCount = isMobile ? 800 : 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);
    const twinklePhases = new Float32Array(starCount);
    const twinkleSpeeds = new Float32Array(starCount);
    
    for (let i = 0; i < starCount; i++) {
        // Position stars in a sphere around the scene
        const radius = 50 + Math.random() * 50;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);
        
        // Vary star colors (warm whites and yellows)
        const colorChoice = Math.random();
        if (colorChoice < 0.3) {
            // White
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 1;
        } else if (colorChoice < 0.6) {
            // Warm white
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 0.95;
            colors[i * 3 + 2] = 0.8;
        } else {
            // Golden (dimmer)
            colors[i * 3] = 0.84 * 0.7;
            colors[i * 3 + 1] = 0.6 * 0.7;
            colors[i * 3 + 2] = 0.13 * 0.7;
        }
        
        // Smaller star sizes
        sizes[i] = Math.random() * 0.5 + 0.1;
        
        // Random twinkle phase and speed for each star
        twinklePhases[i] = Math.random() * Math.PI * 2;
        twinkleSpeeds[i] = 0.5 + Math.random() * 2;
    }
    
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const starsMaterial = new THREE.PointsMaterial({
        size: 0.5,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    
    // Store original sizes and twinkle data for animation
    starSizes = sizes;
    stars.userData.twinklePhases = twinklePhases;
    stars.userData.twinkleSpeeds = twinkleSpeeds;
    stars.userData.originalSizes = new Float32Array(sizes);
}

function onWindowResize() {
    const container = document.getElementById('coffeeViewer');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Create procedural paper cup texture
function createPaperCupTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    // Base paper color with Arabic pattern influence
    ctx.fillStyle = '#f5f5f0';
    ctx.fillRect(0, 0, 256, 256);
    
    // Add geometric pattern overlay
    ctx.strokeStyle = 'rgba(114, 47, 55, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
        const y = i * 32 + 16;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < 256; x += 16) {
            ctx.lineTo(x + 8, y - 8);
            ctx.lineTo(x + 16, y);
        }
        ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1);
    return texture;
}

// Create coffee cup with ingredients
function createCoffeeCup(drinkData) {
    if (currentCup) {
        currentCup.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => material.dispose());
                } else {
                    child.material.dispose();
                }
            }
        });
        scene.remove(currentCup);
    }
    
    const cupGroup = new THREE.Group();
    
    // Create textures
    const paperTexture = createPaperCupTexture();
    
    // Cup geometry (tapered cylinder)
    const cupGeometry = new THREE.CylinderGeometry(CUP_CONFIG.TOP_RADIUS, CUP_CONFIG.BOTTOM_RADIUS, CUP_CONFIG.HEIGHT, CUP_CONFIG.SEGMENTS);
    const cupMaterial = new THREE.MeshPhysicalMaterial({
        map: paperTexture,
        color: new THREE.Color(drinkData.cupColor),
        transparent: true,
        opacity: 0.5,
        roughness: 0.8,
        metalness: 0.0,
        clearcoat: 0.1,
        clearcoatRoughness: 0.9,
        side: THREE.DoubleSide,
        transmission: 0.3,
        thickness: 0.1,
        ior: 1.2
    });
    const cup = new THREE.Mesh(cupGeometry, cupMaterial);
    cupGroup.add(cup);
    
    // Add a rim
    const rimGeometry = new THREE.TorusGeometry(CUP_CONFIG.RIM_RADIUS, CUP_CONFIG.RIM_TUBE_RADIUS, 8, 32);
    const rimMaterial = new THREE.MeshBasicMaterial({
        color: 0xE8A317,
        transparent: true,
        opacity: 0.5
    });
    const cupRim = new THREE.Mesh(rimGeometry, rimMaterial);
    cupRim.position.y = 0.6;
    cupRim.rotation.x = Math.PI / 2;
    cupGroup.add(cupRim);
    
    // Lid
    const lidGeometry = new THREE.CylinderGeometry(CUP_CONFIG.LID_TOP_RADIUS, CUP_CONFIG.LID_BOTTOM_RADIUS, CUP_CONFIG.LID_HEIGHT, CUP_CONFIG.SEGMENTS);
    const lidMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(drinkData.cupColor).multiplyScalar(0.8),
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.1
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.y = 0.65;
    cupGroup.add(lid);
    
    // Add coffee sleeve with Gratified branding
    const sleeveGeometry = new THREE.CylinderGeometry(CUP_CONFIG.SLEEVE_TOP_RADIUS, CUP_CONFIG.SLEEVE_BOTTOM_RADIUS, CUP_CONFIG.SLEEVE_HEIGHT, CUP_CONFIG.SEGMENTS);
    
    // Create sleeve texture
    const sleeveCanvas = document.createElement('canvas');
    sleeveCanvas.width = 512;
    sleeveCanvas.height = 128;
    const sleeveCtx = sleeveCanvas.getContext('2d');
    
    // Arabic pattern-inspired background
    sleeveCtx.fillStyle = '#D2691E';
    sleeveCtx.fillRect(0, 0, 512, 128);
    
    // Add geometric pattern
    sleeveCtx.strokeStyle = 'rgba(114, 47, 55, 0.3)';
    sleeveCtx.lineWidth = 2;
    for (let x = 0; x < 512; x += 32) {
        sleeveCtx.beginPath();
        sleeveCtx.moveTo(x, 0);
        sleeveCtx.lineTo(x + 16, 64);
        sleeveCtx.lineTo(x, 128);
        sleeveCtx.stroke();
    }
    
    // Add "GRATIFIED" text
    sleeveCtx.fillStyle = 'rgba(114, 47, 55, 0.5)';
    sleeveCtx.font = 'bold 20px Amiri, serif';
    sleeveCtx.textAlign = 'center';
    for (let i = 0; i < 4; i++) {
        sleeveCtx.fillText('GRATIFIED', 128 + (i * 128), 64);
    }
    
    const sleeveTexture = new THREE.CanvasTexture(sleeveCanvas);
    sleeveTexture.wrapS = THREE.RepeatWrapping;
    sleeveTexture.repeat.set(1, 1);
    
    const sleeveMaterial = new THREE.MeshStandardMaterial({
        map: sleeveTexture,
        roughness: 0.9,
        metalness: 0.0
    });
    
    const sleeve = new THREE.Mesh(sleeveGeometry, sleeveMaterial);
    sleeve.position.y = 0.1;
    cupGroup.add(sleeve);
    
    // Lid opening
    const openingGeometry = new THREE.CylinderGeometry(CUP_CONFIG.OPENING_RADIUS, CUP_CONFIG.OPENING_RADIUS, CUP_CONFIG.OPENING_HEIGHT, 16);
    const openingMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const opening = new THREE.Mesh(openingGeometry, openingMaterial);
    opening.position.y = 0.65;
    opening.position.x = 0.15;
    cupGroup.add(opening);
    
    // Create ingredient layers
    const totalVolume = drinkData.ingredients.reduce((sum, ing) => sum + ing.volume, 0);
    let currentHeight = -0.5;
    
    drinkData.ingredients.forEach((ingredient, index) => {
        const heightRatio = ingredient.volume / totalVolume;
        const layerHeight = heightRatio * 0.9;
        
        const layerGeometry = new THREE.CylinderGeometry(
            0.35 - (currentHeight + 0.5) * 0.05,
            0.35 - (currentHeight + layerHeight + 0.5) * 0.05,
            layerHeight,
            32
        );
        
        const layerMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color(ingredient.color).multiplyScalar(1.2),
            transparent: true,
            opacity: 0.85,
            roughness: 0.1,
            metalness: 0,
            transmission: 0.3,
            thickness: 0.5,
            emissive: new THREE.Color(ingredient.color).multiplyScalar(0.05),
            emissiveIntensity: 0.1
        });
        
        const layer = new THREE.Mesh(layerGeometry, layerMaterial);
        layer.position.y = currentHeight + layerHeight / 2;
        cupGroup.add(layer);
        
        currentHeight += layerHeight;
    });
    
    // Steam effect
    if (drinkData.steamColor) {
        const steamGeometry = new THREE.BufferGeometry();
        const steamCount = 30;
        const positions = new Float32Array(steamCount * 3);
        
        for (let i = 0; i < steamCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 0.3;
            positions[i * 3 + 1] = 0.7 + Math.random() * 0.5;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
        }
        
        steamGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const steamMaterial = new THREE.PointsMaterial({
            color: new THREE.Color(drinkData.steamColor),
            size: 0.1,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        const steam = new THREE.Points(steamGeometry, steamMaterial);
        cupGroup.add(steam);
    }
    
    currentCup = cupGroup;
    scene.add(cupGroup);
    
    // Animate entrance
    cupGroup.scale.set(0.1, 0.1, 0.1);
    animateCupEntrance();
}

function animateCupEntrance() {
    const targetScale = 1;
    const animationDuration = 500;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const scale = 0.1 + (targetScale - 0.1) * easeProgress;
        
        if (currentCup) {
            currentCup.scale.set(scale, scale, scale);
            currentCup.rotation.y = easeProgress * Math.PI * 2;
        }
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function showDrinkVisualization(drinkKey) {
    const drinkData = menuData[drinkKey];
    if (!drinkData) return;
    
    // Show viewer container first
    document.getElementById('viewerContainer').classList.add('active');
    
    // Small delay to ensure container is visible before initializing Three.js
    setTimeout(() => {
        // Initialize Three.js scene if not already done
        if (!scene) {
            try {
                initThreeScene();
                startRenderLoop();
            } catch (error) {
                console.error('Error initializing Three.js:', error);
                return;
            }
        }
        
        // Update viewer header
        document.getElementById('viewerHeader').textContent = drinkData.name;
        
        // Update active menu item
        document.querySelectorAll('.menu-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const menuItem = document.querySelector(`[data-drink="${drinkKey}"]`);
        if (menuItem) {
            menuItem.classList.add('active');
            activeMenuItem = menuItem;
        }
        
        // Create new cup visualization
        createCoffeeCup(drinkData);
        
        // Force a render
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }, 100);
}

function hideVisualization() {
    document.getElementById('viewerContainer').classList.remove('active');
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
}

// Make hideVisualization globally accessible
window.hideVisualization = hideVisualization;

function startRenderLoop() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    let frameCount = 0;
    
    function animate() {
        requestAnimationFrame(animate);
        frameCount++;
        
        // Animate stars twinkling - reduce frequency on mobile for performance
        const shouldUpdateStars = isMobile ? frameCount % 3 === 0 : true;
        if (stars && stars.geometry.attributes.size && shouldUpdateStars) {
            const time = Date.now() * 0.001;
            const sizes = stars.geometry.attributes.size.array;
            const originalSizes = stars.userData.originalSizes;
            const phases = stars.userData.twinklePhases;
            const speeds = stars.userData.twinkleSpeeds;
            
            for (let i = 0; i < sizes.length; i++) {
                const twinkle = Math.sin(time * speeds[i] + phases[i]) * 0.5 + 0.5;
                sizes[i] = originalSizes[i] * (0.3 + twinkle * 0.7);
            }
            
            stars.geometry.attributes.size.needsUpdate = true;
        }
        
        // Rotate steam particles
        if (currentCup) {
            currentCup.children.forEach(child => {
                if (child instanceof THREE.Points && child !== stars) {
                    child.rotation.y += 0.005;
                    
                    // Animate steam particles upward
                    const positions = child.geometry.attributes.position.array;
                    for (let i = 1; i < positions.length; i += 3) {
                        positions[i] += 0.005;
                        if (positions[i] > 1.5) {
                            positions[i] = 0.7;
                        }
                    }
                    child.geometry.attributes.position.needsUpdate = true;
                }
            });
        }
        
        if (controls) {
            controls.update();
        }
        
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
        }
    }
    
    animate();
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Add hover listeners to specialty drink items
    const specialtyDrinks = document.querySelectorAll('.menu-item[data-drink]');
    const viewerContainer = document.getElementById('viewerContainer');
    let hideTimeout = null;
    
    // Function to clear hide timeout
    const clearHideTimeout = () => {
        if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
        }
    };
    
    // Function to start hide timeout
    const startHideTimeout = () => {
        clearHideTimeout();
        hideTimeout = setTimeout(() => {
            hideVisualization();
        }, 300); // 300ms delay before hiding
    };
    
    specialtyDrinks.forEach(item => {
        item.addEventListener('mouseenter', () => {
            clearHideTimeout();
            const drinkKey = item.getAttribute('data-drink');
            showDrinkVisualization(drinkKey);
        });
        
        item.addEventListener('mouseleave', () => {
            startHideTimeout();
        });
        
        // Mobile touch support
        item.addEventListener('click', (e) => {
            e.preventDefault();
            clearHideTimeout();
            const drinkKey = item.getAttribute('data-drink');
            if (item.classList.contains('active')) {
                hideVisualization();
            } else {
                showDrinkVisualization(drinkKey);
            }
        });
    });
    
    // Keep viewer open when hovering over it
    viewerContainer.addEventListener('mouseenter', () => {
        clearHideTimeout();
    });
    
    viewerContainer.addEventListener('mouseleave', () => {
        startHideTimeout();
    });
    
    // Close viewer when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu-item[data-drink]') && 
            !e.target.closest('.viewer-container')) {
            hideVisualization();
        }
    });
});