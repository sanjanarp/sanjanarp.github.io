// Hogwarts Entrance Animation Script

document.addEventListener('DOMContentLoaded', function () {
    const entrance = document.getElementById('entrance');
    const doors = document.getElementById('doors');

    // Remove entrance overlay after animation
    setTimeout(() => {
        entrance.classList.remove('active');
    }, 4000);

    // Open magical doors
    setTimeout(() => {
        doors.classList.add('doors-open');
    }, 3500);

    // Remove doors completely after opening
    setTimeout(() => {
        doors.style.display = 'none';
    }, 5500);
});
