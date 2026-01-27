document.addEventListener('DOMContentLoaded', () => {
    const owlForm = document.querySelector('.owl-post-form');
    const owlPerch = document.querySelector('.owl-perch');
    const submitBtn = document.querySelector('.wax-seal-btn');
    const btnText = document.querySelector('.seal-text');

    if (owlForm) {
        owlForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Stamp Effect
            submitBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                submitBtn.style.transform = 'scale(1.05) rotate(5deg)';
                btnText.textContent = "Sent!";
                submitBtn.style.background = "radial-gradient(circle at 30% 30%, #4a2c2a, #2c1810)"; // Darkened wax
            }, 150);

            // 2. Owl Flight Animation
            if (owlPerch) {
                // Add class to trigger CSS flight
                owlPerch.classList.add('flying-away');

                // Play hoot sound? (Optional, skipping for now)
            }

            // 3. Reset form after delay
            setTimeout(() => {
                owlForm.reset();
                btnText.textContent = "Send";
                submitBtn.style.background = ""; // Reset color

                // Reset owl position after it's gone
                setTimeout(() => {
                    owlPerch.classList.remove('flying-away');
                }, 1000); // Wait for flight to finish invisible

            }, 4000);
        });
    }
});
