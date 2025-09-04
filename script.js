// DOM Elements
const solarSystem = document.querySelector('.solar-system');
const toggleOrbitsBtn = document.getElementById('toggleOrbits');
const toggleLabelsBtn = document.getElementById('toggleLabels');
const speedControl = document.getElementById('speedControl');
const pauseResumeBtn = document.getElementById('pauseResume');
const planetInfo = document.getElementById('planetInfo');

// Planet data
const planets = [
    { name: 'Mercury', element: document.querySelector('.mercury'), orbitSpeed: 4.1, size: '3,032 km', distance: '57.9M km', year: '88 Earth days' },
    { name: 'Venus', element: document.querySelector('.venus'), orbitSpeed: 1.6, size: '7,521 km', distance: '108.2M km', year: '225 Earth days' },
    { name: 'Earth', element: document.querySelector('.earth'), orbitSpeed: 1, size: '7,918 km', distance: '149.6M km', year: '365.25 days', 
      moons: [{ name: 'Moon', size: '3,474 km', distance: '384,400 km', year: '27.3 days' }] },
    { name: 'Mars', element: document.querySelector('.mars'), orbitSpeed: 0.5, size: '4,212 km', distance: '227.9M km', year: '687 Earth days' },
    { name: 'Jupiter', element: document.querySelector('.jupiter'), orbitSpeed: 0.08, size: '139,822 km', distance: '778.5M km', year: '11.9 Earth years' },
    { name: 'Saturn', element: document.querySelector('.saturn'), orbitSpeed: 0.03, size: '116,464 km', distance: '1.4B km', year: '29.5 Earth years' },
    { name: 'Uranus', element: document.querySelector('.uranus'), orbitSpeed: 0.01, size: '50,724 km', distance: '2.9B km', year: '84 Earth years' },
    { name: 'Neptune', element: document.querySelector('.neptune'), orbitSpeed: 0.006, size: '49,244 km', distance: '4.5B km', year: '165 Earth years' }
];

// Animation state
let animationId;
let isPaused = false;
let showOrbits = true;
let showLabels = false;
let speed = 1;
let angle = 0;
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

// Initialize the solar system
function init() {
    // Set up event listeners
    setupEventListeners();
    
    // Add data attributes to planets
    planets.forEach(planet => {
        planet.element.setAttribute('data-planet', planet.name);
        
        // Add click event to show planet info
        planet.element.addEventListener('click', (e) => {
            e.stopPropagation();
            showPlanetInfo(planet);
        });
    });
    
    // Start animation
    animate();
}

// Set up event listeners
function setupEventListeners() {
    // Toggle orbits with smooth transition
    toggleOrbitsBtn.addEventListener('click', () => {
        showOrbits = !showOrbits;
        const orbits = document.querySelectorAll('.orbit');
        orbits.forEach(orbit => {
            orbit.style.transition = 'border-color 0.5s ease';
            orbit.style.borderColor = showOrbits ? 'rgba(255, 255, 255, 0.1)' : 'transparent';
        });
        toggleOrbitsBtn.classList.toggle('active', showOrbits);
    });
    
    // Toggle labels for planet names
    toggleLabelsBtn.addEventListener('click', () => {
        showLabels = !showLabels;
        const planets = document.querySelectorAll('.planet');
        planets.forEach(planet => {
            let label = planet.querySelector('.planet-label');
            if (!label && showLabels) {
                // Create label if it doesn't exist
                label = document.createElement('div');
                label.className = 'planet-label';
                label.textContent = planet.parentElement.classList[0].replace('-orbit', '');
                planet.appendChild(label);
            } else if (label && !showLabels) {
                // Remove label if it exists and we're hiding labels
                planet.removeChild(label);
            }
        });
        toggleLabelsBtn.classList.toggle('active', showLabels);
    });
    
    // Speed control
    speedControl.addEventListener('input', (e) => {
        speed = parseFloat(e.target.value);
    });
    
    // Pause/Resume animation
    pauseResumeBtn.addEventListener('click', () => {
        isPaused = !isPaused;
        pauseResumeBtn.textContent = isPaused ? 'Resume' : 'Pause';
        if (!isPaused) {
            animate();
        }
    });
    
    // Close info panel when clicking outside
    document.addEventListener('click', () => {
        planetInfo.querySelector('.card-body').innerHTML = '<p>Click on a planet to see its details</p>';
    });
    
    // Mouse move for 3D effect
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.0005;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.0005;
    });
    
    // Touch events for mobile
    document.addEventListener('touchmove', (e) => {
        e.preventDefault();
        mouseX = (e.touches[0].clientX - window.innerWidth / 2) * 0.0005;
        mouseY = (e.touches[0].clientY - window.innerHeight / 2) * 0.0005;
    }, { passive: false });
}

// Show planet information with smooth animation
function showPlanetInfo(planet) {
    event.stopPropagation();
    
    const cardBody = planetInfo.querySelector('.card-body');
    
    // Add fade out effect
    cardBody.style.opacity = '0';
    cardBody.style.transition = 'opacity 0.3s ease';
    
    // After fade out, update content and fade in
    setTimeout(() => {
        let infoHTML = `
            <div class="planet-header">
                <h4>${planet.name}</h4>
                <div class="planet-icon" style="background: ${getPlanetColor(planet.name)}"></div>
            </div>
            <div class="planet-details">
                <p><i class="fas fa-ruler"></i> <strong>Diameter:</strong> ${planet.size}</p>
                <p><i class="fas fa-sun"></i> <strong>Distance from Sun:</strong> ${planet.distance}</p>
                <p><i class="fas fa-hourglass-half"></i> <strong>Year Length:</strong> ${planet.year}</p>
            </div>
        `;
        
        if (planet.moons) {
            infoHTML += '<div class="moons-section">';
            infoHTML += '<h5><i class="fas fa-moon"></i> Moons</h5>';
            planet.moons.forEach(moon => {
                infoHTML += `
                    <div class="moon-info">
                        <div class="moon-icon"></div>
                        <div class="moon-details">
                            <p class="moon-name">${moon.name}</p>
                            <p class="moon-stats">${moon.size} • ${moon.distance} from ${planet.name}</p>
                        </div>
                    </div>
                `;
            });
            infoHTML += '</div>';
        }
        
        cardBody.innerHTML = infoHTML;
        
        // Add fade in effect
        setTimeout(() => {
            cardBody.style.opacity = '1';
        }, 10);
    }, 300);
}

// Helper function to get planet color
function getPlanetColor(planetName) {
    const colors = {
        'mercury': '#a52a2a',
        'venus': '#deb887',
        'earth': '#4169e1',
        'mars': '#b22222',
        'jupiter': '#d2b48c',
        'saturn': '#f4a460',
        'uranus': '#add8e6',
        'neptune': '#1e90ff'
    };
    return colors[planetName.toLowerCase()] || '#ffffff';
}

// Animation loop
function animate() {
    if (isPaused) {
        animationId = requestAnimationFrame(animate);
        return;
    }
    
    // Update rotation based on mouse position for 3D effect
    targetX = Math.max(-30, Math.min(30, mouseY * 0.5));
    targetY = mouseX * 0.5;
    
    // Smooth the rotation
    const currentX = parseFloat(solarSystem.style.getPropertyValue('--rotateX') || '60');
    const currentY = parseFloat(solarSystem.style.getPropertyValue('--rotateY') || '0');
    
    const newX = currentX + (targetX - currentX) * 0.05;
    const newY = currentY + (targetY - currentY) * 0.05;
    
    solarSystem.style.setProperty('--rotateX', `${newX}deg`);
    solarSystem.style.setProperty('--rotateY', `${newY}deg`);
    
    // Apply rotation to the solar system with perspective (excluding the sun)
    solarSystem.style.transform = `translate(-50%, -50%) perspective(1000px) rotateX(var(--rotateX, 60deg)) rotateY(var(--rotateY, 0deg))`;
    
    // Update planet positions
    angle += 0.002 * speed;
    
    // Get the sun element
    const sun = document.querySelector('.sun');
    
    planets.forEach((planet, index) => {
        const planetElement = planet.element.parentElement; // Get the orbit element
        const rotationAngle = angle * planet.orbitSpeed;
        
        // Apply rotation to the orbit (all planets rotate in the same direction)
        planetElement.style.transform = `translate(-50%, -50%) rotateX(60deg) rotateY(${rotationAngle}rad)`;
        
        // Position the planet along its orbit
        const orbitRadius = parseFloat(planetElement.style.width || '0') / 2;
        const x = Math.cos(rotationAngle) * orbitRadius;
        const z = Math.sin(rotationAngle) * orbitRadius;
        
        // Position the planet in 3D space
        planet.element.style.transform = `translate3d(calc(-50% + ${x}px), -50%, ${z}px) rotateY(${-rotationAngle}rad)`;
        
        // Make planets rotate on their axis
        planet.element.style.animation = `rotate ${20 / planet.orbitSpeed}s linear infinite`;
        
        // Set z-index based on z-position for proper layering
        const zIndex = 1000 + Math.round(z) + index;
        planet.element.style.zIndex = zIndex;
        
        // Ensure planets are always above the sun
        if (sun) {
            sun.style.zIndex = 0;
        }
    });
    
    // Continue the animation loop
    animationId = requestAnimationFrame(animate);
}

// Handle window resize
function handleResize() {
    // Adjust any responsive elements here
}

// Initialize the solar system when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle window resize
window.addEventListener('resize', handleResize);

// Add CSS for planet rotation
const style = document.createElement('style');
style.textContent = `
    @keyframes rotate {
        from { transform: translate(-50%, -50%) rotateY(0deg); }
        to { transform: translate(-50%, -50%) rotateY(360deg); }
    }
`;
document.head.appendChild(style);
