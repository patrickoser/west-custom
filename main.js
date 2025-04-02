// Theme switching functionality
const themeToggle = document.getElementById('theme-toggle');
const icon = themeToggle.querySelector('i');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Mobile menu functionality
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu after clicking a link
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Form submission handling
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    try {
        // Here you would typically send the data to your backend
        // For now, we'll just show a success message
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
    } catch (error) {
        alert('There was an error sending your message. Please try again later.');
        console.error('Error:', error);
    }
});

// Navbar background change on scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    }
    
    lastScroll = currentScroll;
});

// Add animation to gallery items on scroll
const galleryItems = document.querySelectorAll('.gallery-item');

const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

galleryItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(item);
});

// Lightbox functionality
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const closeLightbox = document.querySelector('.close-lightbox');
const prevButton = document.querySelector('.prev-image');
const nextButton = document.querySelector('.next-image');
let currentImageIndex = 0;

// Open lightbox
galleryItems.forEach((img, index) => {
    img.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox(img);
    });
});

// Close lightbox
closeLightbox.addEventListener('click', closeLightboxView);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightboxView();
    }
});

// Navigation
prevButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxImage();
});

nextButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
    updateLightboxImage();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeLightboxView();
    } else if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxImage();
    } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        updateLightboxImage();
    }
});

function openLightbox(img) {
    lightbox.classList.add('active');
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
    document.body.style.overflow = 'hidden';
}

function closeLightboxView() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function updateLightboxImage() {
    const img = galleryItems[currentImageIndex];
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
} 