document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('footprints-container');
    const svgContainer = document.querySelector('.map-path-container');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !container || !svgContainer) return;

    function generateFootprints() {
        container.innerHTML = ''; // Clear previous

        const cards = document.querySelectorAll('.timeline-item');
        if (cards.length < 2) return;

        const containerRect = svgContainer.getBoundingClientRect();

        // Pairs: 0->1, 1->2, 2->3 with custom blue-line logic
        const connections = [
            // Path 1: Card 1 Right -> Card 2 Top (High Arcing "Blue Line")
            { startSide: 'right', endSide: 'top', type: 'high-arc' },
            // Path 2: Card 2 Left -> Card 3 Top (S-Curve Down)
            { startSide: 'left', endSide: 'top', type: 'mid-drop' },
            // Path 3: Card 3 Bottom -> Card 4 Left (Scoop)
            { startSide: 'bottom', endSide: 'left', type: 'low-scoop' }
        ];

        for (let i = 0; i < Math.min(cards.length - 1, connections.length); i++) {
            const startCard = cards[i];
            const endCard = cards[i + 1];
            const config = connections[i];

            const startRect = startCard.getBoundingClientRect();
            const endRect = endCard.getBoundingClientRect();

            // Helper to get anchor coordinates relative to container
            const getAnchor = (rect, side) => {
                const relLeft = rect.left - containerRect.left;
                const relTop = rect.top - containerRect.top;

                switch (side) {
                    case 'right': return { x: relLeft + rect.width, y: relTop + rect.height * 0.3 }; // Slightly top-right
                    case 'left': return { x: relLeft, y: relTop + rect.height * 0.5 };
                    case 'top': return { x: relLeft + rect.width * 0.5, y: relTop };
                    case 'bottom': return { x: relLeft + rect.width * 0.7, y: relTop + rect.height }; // Slightly right-bottom
                    default: return { x: relLeft + rect.width / 2, y: relTop + rect.height / 2 };
                }
            };

            const startPt = getAnchor(startRect, config.startSide);
            const endPt = getAnchor(endRect, config.endSide);

            // Connected directly to borders (no buffer) for seamless link

            let pathD = '';

            if (config.type === 'high-arc') {
                // High Arc: Gentle Loop (Flattened)
                pathD = `M ${startPt.x} ${startPt.y} C ${startPt.x + 80} ${startPt.y - 60}, ${endPt.x + 30} ${endPt.y - 50}, ${endPt.x} ${endPt.y}`;
            } else if (config.type === 'mid-drop') {
                // Left to Top: Straight Line (Shortest Possible)
                pathD = `M ${startPt.x} ${startPt.y} L ${endPt.x} ${endPt.y}`;
            } else if (config.type === 'low-scoop') {
                // Bottom to Left: Deep Scoop (Down then Left)
                pathD = `M ${startPt.x} ${startPt.y} C ${startPt.x + 20} ${startPt.y + 120}, ${endPt.x - 120} ${endPt.y + 20}, ${endPt.x} ${endPt.y}`;
            } else {
                // Fallback Linear
                pathD = `M ${startPt.x} ${startPt.y} L ${endPt.x} ${endPt.y}`;
            }

            // Create Path Element
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", pathD);

            spawnStepsOnPath(path, container);
        }
    }

    function spawnStepsOnPath(path, container) {
        const length = path.getTotalLength();
        const STEP_DISTANCE = 45; // Reverted to 1.5rem params
        const STEP_STAGGER_X = 26; // Reverted to 1.5rem params

        // Ensure we cover the full length including the very end
        const stepsCount = Math.ceil(length / STEP_DISTANCE);

        for (let j = 0; j <= stepsCount; j++) {
            let distance = j * STEP_DISTANCE;

            // Force the last step to be exactly at the end
            if (distance > length) distance = length;
            // Also if it's the last iteration index, force it to 'length' to catch remainders
            if (j === stepsCount) distance = length;

            // Avoid placing two steps very close to each other at the end
            if (j > 0 && distance === (j - 1) * STEP_DISTANCE) continue; // Skip if duplicate
            if (j > 0 && (distance - ((j - 1) * STEP_DISTANCE)) < 10) continue; // Skip if <10px from prev

            // Calculate Angle
            // For the very last point, we need to look BACKWARDS to get the angle
            let p1, p2;
            if (distance < length) {
                p1 = path.getPointAtLength(distance);
                p2 = path.getPointAtLength(Math.min(distance + 5, length)); // Look ahead 5px
            } else {
                // At end, look back 5px
                p1 = path.getPointAtLength(Math.max(0, distance - 5));
                p2 = path.getPointAtLength(distance);
            }

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            let angle = Math.atan2(dy, dx) * (180 / Math.PI);

            // Position is the current distance
            const point = path.getPointAtLength(distance);

            const step = document.createElement('div');
            step.classList.add('marauder-step');

            // Inner span for animation to avoid transform conflicts
            const inner = document.createElement('span');
            inner.classList.add('marauder-inner');
            inner.textContent = '👣';

            // Stagger animation delay
            inner.style.animationDelay = `${j * 300}ms`;

            step.appendChild(inner);

            const isLeft = j % 2 === 0;
            const len = Math.sqrt(dx * dx + dy * dy);
            const perpX = -dy / len;
            const perpY = dx / len;

            const offsetX = (isLeft ? -1 : 1) * STEP_STAGGER_X * perpX;
            const offsetY = (isLeft ? -1 : 1) * STEP_STAGGER_X * perpY;

            step.style.left = `${point.x + offsetX}px`;
            step.style.top = `${point.y + offsetY}px`;
            // Only handle rotation and position here. Scale handled by CSS on inner.
            step.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;

            container.appendChild(step);

            // Break if we hit end
            if (distance >= length) break;
        }
    }

    // Init
    // Delay slightly to ensure layout is done (fonts loaded etc)
    setTimeout(generateFootprints, 100);

    // Re-calc on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(generateFootprints, 200);
    });

});
