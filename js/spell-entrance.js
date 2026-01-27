document.addEventListener('DOMContentLoaded', () => {
    const entrance = document.getElementById('entrance');
    const particlesContainer = document.getElementById('spell-particles');
    const doors = document.getElementById('doors');
    const instruction = document.querySelector('.entrance-instruction');
    const guidePath = document.getElementById('guide-path');
    const progressPath = document.getElementById('progress-path');
    const svgContainer = document.querySelector('.spell-path-svg');

    let revealed = false;
    let isTracing = false;
    let progress = 0; // 0 to 1

    // State
    const PATH_POINTS = 100;
    const LOOKAHEAD = 20; // 20% of path lookahead
    const TOLERANCE = 80; // Increased tolerance for better UX
    let pathPoints = [];
    let currentPointIndex = 0;

    // Create Wand Cursor Element
    const wandCursor = document.createElement('div');
    wandCursor.className = 'wand-cursor';
    wandCursor.innerText = '🪄';
    document.body.appendChild(wandCursor);

    // Initial State
    document.body.style.overflow = 'hidden';

    // Initialize progress path
    let totalLength = 0;
    if (guidePath) {
        totalLength = guidePath.getTotalLength();
        progressPath.style.strokeDasharray = totalLength;
        progressPath.style.strokeDashoffset = totalLength;
    }

    // Pre-calculate path points in screen coordinates
    function updatePathPoints() {
        if (!guidePath) return;

        pathPoints = [];
        totalLength = guidePath.getTotalLength();
        progressPath.style.strokeDasharray = totalLength;
        const currentDrawLength = totalLength * (1 - progress);
        progressPath.style.strokeDashoffset = currentDrawLength; // Maintain progress visually

        // Ensure SVG is visible and layout computed
        if (svgContainer.getBoundingClientRect().width === 0) return;

        for (let i = 0; i <= PATH_POINTS; i++) {
            const point = guidePath.getPointAtLength((i / PATH_POINTS) * totalLength);
            const screenPoint = svgToScreen(point);
            pathPoints.push({ x: screenPoint.x, y: screenPoint.y, progress: i / PATH_POINTS });
        }
    }

    // Convert SVG coordinates to screen coordinates
    function svgToScreen(svgPoint) {
        const point = svgContainer.createSVGPoint();
        point.x = svgPoint.x;
        point.y = svgPoint.y;
        const ctm = svgContainer.getScreenCTM();
        return point.matrixTransform(ctm);
    }

    // Particle Configuration
    const PARTICLE_TYPES = ['sparkle', 'orb', 'wisp'];
    const COLORS = ['#ffd700', '#ffffff', '#ffb7c5'];

    function createParticle(x, y, duration = 1000) {
        if (revealed) return;

        const type = PARTICLE_TYPES[Math.floor(Math.random() * PARTICLE_TYPES.length)];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];

        const particle = document.createElement('div');
        particle.className = `p-${type}`;

        const size = (Math.random() * 5 + 2);
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = color;
        particle.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 10 + 5; // Slower speed for trail
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;

        particle.style.setProperty('--tx', `${vx}px`);
        particle.style.setProperty('--ty', `${vy}px`);

        // Set duration dynamically
        particle.style.animationDuration = `${duration}ms`;

        particlesContainer.appendChild(particle);

        setTimeout(() => particle.remove(), duration);
    }

    function handleInteraction(e) {
        if (revealed) return;

        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0].clientY);

        if (!x || !y) return;

        // Move Wand Cursor
        wandCursor.style.display = 'block';
        wandCursor.style.left = `${x}px`;
        wandCursor.style.top = `${y}px`;

        const tilt = (x / window.innerWidth - 0.5) * 30 - 15;
        wandCursor.style.transform = `rotate(${tilt}deg)`;

        // Find closest point in lookahead window
        let bestDist = Infinity;
        let bestIndex = -1;
        const searchEnd = Math.min(currentPointIndex + LOOKAHEAD, PATH_POINTS);

        // If we haven't started (progress near 0), check the beginning
        const startIndex = currentPointIndex;

        for (let i = startIndex; i <= searchEnd; i++) {
            const p = pathPoints[i];
            if (!p) continue;

            const dist = Math.hypot(x - p.x, y - p.y);
            if (dist < bestDist) {
                bestDist = dist;
                bestIndex = i;
            }
        }

        // If we found a valid point forward within tolerance
        if (bestIndex !== -1 && bestDist < TOLERANCE) {
            isTracing = true;

            // Update progress if we moved forward
            if (bestIndex > currentPointIndex) {
                for (let i = currentPointIndex + 1; i <= bestIndex; i++) {
                    // Emit particles at points we covered to form a trail
                    if (pathPoints[i] && i % 2 === 0) {
                        // Create specific trail particle
                        const particle = document.createElement('div');
                        particle.className = 'p-trail';
                        const size = 4;
                        particle.style.width = `${size}px`;
                        particle.style.height = `${size}px`;
                        particle.style.left = `${pathPoints[i].x}px`;
                        particle.style.top = `${pathPoints[i].y}px`;

                        particlesContainer.appendChild(particle);
                        setTimeout(() => particle.remove(), 3000);
                    }
                }

                currentPointIndex = bestIndex;
                progress = pathPoints[bestIndex].progress;

                // Visual Updates (SVG path is hidden via CSS, but we keep this for logic/fallback)
                const drawLength = totalLength * (1 - progress);
                progressPath.style.strokeDashoffset = drawLength;

                // Extra sparkles for the "action"
                if (Math.random() > 0.3) createParticle(x, y, 1000);

                // Update instruction opacity
                instruction.style.opacity = 1 - progress;

                // Check completion
                if (progress >= 0.9) {
                    revealSite();
                }
            }
        }
    }

    function revealSite() {
        if (revealed) return;
        revealed = true;

        // Final burst of magic
        for (let i = 0; i < 50; i++) {
            const x = window.innerWidth / 2;
            const y = window.innerHeight / 2;
            createParticle(x, y, 1500);
        }

        entrance.classList.add('fading');
        wandCursor.style.display = 'none'; // Hide wand
        document.body.style.cursor = 'auto'; // Restore cursor

        setTimeout(() => {
            doors.classList.add('doors-open');
        }, 300);

        setTimeout(() => {
            entrance.style.display = 'none';
            document.body.style.overflow = 'auto';
            window.dispatchEvent(new CustomEvent('site-revealed'));
        }, 2000); // Wait for door animation
    }

    // Initialize
    setTimeout(updatePathPoints, 100);
    window.addEventListener('resize', updatePathPoints);

    window.addEventListener('mousemove', handleInteraction);
    window.addEventListener('touchmove', handleInteraction);

    document.addEventListener('mouseleave', () => {
        wandCursor.style.display = 'none';
    });
});
