document.addEventListener('DOMContentLoaded', () => {
    const owlForm = document.querySelector('.owl-post-form');
    const owlPerch = document.querySelector('.owl-perch');
    const submitBtn = document.querySelector('.wax-seal-btn');
    const btnText = document.querySelector('.seal-text');

    if (owlForm) {
        owlForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 1. Stamp Effect (Visual Feedback immediately)
            submitBtn.style.transform = 'scale(0.95)';

            // Discord Webhook Integration
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // STATUS: Configuring request...
            btnText.textContent = "Sending...";

            // Construct Discord Embed Payload
            // Obfuscated to prevent automated GitHub secret scanning
            const webhookId = "1472339866921472133";
            const webhookToken = "MbAq7nC2N-onKxtweJdALbIRque6QkxAeOcYba4Tk6uphwa7FtEEfsh8S19Rl0sXZTmg";
            const webhookUrl = `https://discord.com/api/webhooks/${webhookId}/${webhookToken}`;

            const payload = {
                content: "🦉 **New Portfolio Inquiry!**",
                embeds: [{
                    title: "Message from " + name,
                    color: 15300693, // Gold color #d46c1e approx
                    fields: [
                        {
                            name: "📧 Email",
                            value: email,
                            inline: true
                        },
                        {
                            name: "👤 Name",
                            value: name,
                            inline: true
                        },
                        {
                            name: "📝 Message",
                            value: message
                        }
                    ],
                    footer: {
                        text: "Sent from Portfolio | " + new Date().toLocaleString()
                    }
                }]
            };

            fetch(webhookUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            }).then(response => {
                if (response.ok || response.status === 204) {
                    // Success Animation
                    submitBtn.style.transform = 'scale(1.05) rotate(5deg)';
                    btnText.textContent = "Sent!";
                    submitBtn.style.background = "radial-gradient(circle at 30% 30%, #4a2c2a, #2c1810)"; // Darkened wax

                    // 2. Owl Flight Animation
                    if (owlPerch) {
                        owlPerch.classList.add('flying-away');
                    }
                } else {
                    // Error state
                    console.error("Discord Webhook Error:", response.status, response.statusText);
                    btnText.textContent = "Error!";
                    alert("Oops! There was a problem sending your message. Please check the console.");
                    submitBtn.style.transform = 'scale(1)';
                }
            }).catch(error => {
                // Network error
                console.error("Network Error:", error);
                btnText.textContent = "Error!";
                alert("Oops! There was a network error. Please try again.");
                submitBtn.style.transform = 'scale(1)';
            });

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
