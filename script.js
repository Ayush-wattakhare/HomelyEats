// Toggle Menu for Mobile
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// Scroll to How It Works Section
document.querySelector('.cta-button').addEventListener('click', () => {
    document.querySelector('.how-it-works').scrollIntoView({ behavior: 'smooth' });
});
