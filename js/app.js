document.addEventListener('DOMContentLoaded', () => {

    // 1. Hacker Decode Effect (Futuristic GenAI Vibe)
    const heroTitle = document.querySelector('.hero h1');
    const originalText = "Building intelligent systems<br>for a <span class=\"text-gradient\">smarter future.</span>";
    // We will target specific text nodes to decode if we want, or just the whole thing
    // For simplicity and impact, let's decode the "Role" tag or the main headers

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    function decodeEffect(element) {
        let iterations = 0;
        const originalContent = element.innerText;

        const interval = setInterval(() => {
            element.innerText = originalContent.split("")
                .map((letter, index) => {
                    if (index < iterations) {
                        return originalContent[index];
                    }
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");

            if (iterations >= originalContent.length) {
                clearInterval(interval);
            }

            iterations += 1 / 3;
        }, 30);
    }

    // Apply decode to the Role Tag on load
    const roleTag = document.querySelector('.role-tag');
    if (roleTag) {
        // Wait a bit for entry
        setTimeout(() => decodeEffect(roleTag), 500);
    }

    // Easier approach: Just apply the class to existing elements with delays
    const animatedElements = document.querySelectorAll('.fade-in-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => observer.observe(el));

    // 1.5 Envelope Scroll Trigger (Magical Opening)
    const envelopes = document.querySelectorAll('.admission-letter');
    const envelopeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('open');
            } else {
                entry.target.classList.remove('open');
            }
        });
    }, {
        threshold: 0.6 // Trigger when 60% visible for a deliberate "reading" effect
    });

    envelopes.forEach(env => envelopeObserver.observe(env));

    // 2. Mouse Spotlight Tracker
    const spotlight = document.createElement('div');
    spotlight.classList.add('spotlight-overlay');
    document.body.appendChild(spotlight);

    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Update CSS variables for the spotlight
        document.body.style.setProperty('--mouse-x', `${x}px`);
        document.body.style.setProperty('--mouse-y', `${y}px`);
    });

    // 3. Magnetic Buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate center relative position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const deltaX = (x - centerX) / 8; // Strength of magnet
            const deltaY = (y - centerY) / 8;

            btn.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // 4. Smooth Scroll & Navbar Scroll Effect
    const navHeader = document.querySelector('.nav-header');
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');

    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            navHeader.classList.toggle('nav-active');
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navHeader.classList.add('scrolled');
        } else {
            navHeader.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            // Close mobile menu on click
            navHeader.classList.remove('nav-active');

            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// 5. Avatar 3D Tilt Effect
// 5. Skating Avatar Logic (Bouncing around the hero section)
const heroSection = document.querySelector('.hero');
const skater = document.querySelector('.hero-avatar');

if (heroSection && skater) {
    // Zig-Zag Flight Logic (Continuous Bounce, Edge-only Turns)
    const skaterWrapper = skater.querySelector('.avatar-wrapper');

    const state = {
        x: window.innerWidth * 0.1,
        y: 100,
        vx: 3.0,
        vDir: 1, // 1 for down, -1 for up
        facing: 1,
        noiseTime: Math.random() * 1000
    };

    function animateSkater() {
        if (!skater || !skaterWrapper) return;

        const w = window.innerWidth;
        const h = heroSection.clientHeight || 800;

        // 1. Horizontal Movement
        state.x += state.facing === 1 ? 1.5 : -1.5; // Slowed down from 3.0

        // 2. Vertical Movement (Continuous Bounce)
        state.noiseTime += 0.01;
        const vSpeed = 0.5;
        const wave = Math.sin(state.noiseTime * 2) * 2;

        // Change vertical direction at bounds
        if (state.y > h - 150) state.vDir = -1;
        if (state.y < 150) state.vDir = 1;

        state.y += (vSpeed * state.vDir) + wave;

        // 3. Boundary Detection (Horizontal Zig-Zag - Flip OFF-SCREEN)
        const offScreenMargin = 180;
        if (state.x > w + offScreenMargin && state.facing === 1) {
            state.facing = -1;
        } else if (state.x < -offScreenMargin && state.facing === -1) {
            state.facing = 1;
        }

        // 5. Visual Orientation
        // Slight banking based on vertical noise
        const tilt = wave * 2;

        // Bobbing (Fine vibration)
        const bob = Math.sin(Date.now() / 400) * 5;

        // Apply Transform
        // Outer: Position
        skater.style.transform = `translate3d(${state.x}px, ${state.y + bob}px, 0) translate(-50%, -50%)`;

        // Inner: Flip & Tilt (CSS Transition handles the snap)
        skaterWrapper.style.transform = `scaleX(${state.facing}) rotate(${tilt}deg)`;

        requestAnimationFrame(animateSkater);
    }

    animateSkater();

    // Interaction: Mouse pushes scale slightly?
    // Let's keep it simple: No interaction breaking the infinite loop for now as per "I want the path to be like an infinity"
    // user instruction was specific about the path.
    // 6. Dynamic Magical Stars (Screen-Filling)
    function initMagicalStars() {
        const starContainers = [
            { el: document.querySelector('.stars'), count: 150, size: 1 },
            { el: document.querySelector('.stars2'), count: 100, size: 2 },
            { el: document.querySelector('.stars3'), count: 50, size: 3 }
        ];

        const w = window.innerWidth * 1.5; // Wider for overflow coverage
        const h = window.innerHeight * 1.2;

        starContainers.forEach(container => {
            if (!container.el) return;
            let shadows = [];
            for (let i = 0; i < container.count; i++) {
                const x = Math.floor(Math.random() * w);
                const y = Math.floor(Math.random() * h);
                const color = i % 3 === 0 ? '#d4af37' : (i % 3 === 1 ? '#9c27b0' : '#ffffff');
                shadows.push(`${x}px ${y}px ${color}`);
            }
            container.el.style.boxShadow = shadows.join(', ');
            container.el.style.width = '2px';
            container.el.style.height = '2px';
        });
    }

    initMagicalStars();
    window.addEventListener('resize', initMagicalStars);

}
