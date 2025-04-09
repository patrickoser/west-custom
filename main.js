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

// File upload handling
const fileInput = document.getElementById('attachments');
const fileList = document.querySelector('.file-list');
const fileCounter = document.querySelector('.file-counter');
let selectedFiles = [];

const MAX_FILES = 8;
const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

// Update counter initially
updateFileCounter();

// Message display function
function showMessage(message, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;

    // Add icon based on message type
    const icon = document.createElement('i');
    icon.className = type === 'success' 
        ? 'fas fa-check-circle'
        : 'fas fa-exclamation-circle';
    messageElement.appendChild(icon);

    // Add message text
    const text = document.createElement('span');
    text.textContent = message;
    messageElement.appendChild(text);

    // Add to document
    document.body.appendChild(messageElement);

    // Remove after 5 seconds with fade out animation
    setTimeout(() => {
        messageElement.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => {
            messageElement.remove();
        }, 500);
    }, 5000);
}

fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            showMessage(`File "${file.name}" exceeds the 25MB size limit.`, 'error');
            return;
        }

        // Check total files limit
        if (selectedFiles.length >= MAX_FILES) {
            showMessage(`Maximum ${MAX_FILES} files allowed.`, 'error');
            return;
        }

        // Check for duplicate files
        if (!selectedFiles.some(f => f.name === file.name)) {
            selectedFiles.push(file);
            addFileToList(file);
            updateFileCounter();
        }
    });
});

function addFileToList(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const icon = document.createElement('i');
    icon.className = getFileIcon(file.type);
    
    const name = document.createElement('span');
    name.textContent = file.name;
    
    const size = document.createElement('span');
    size.className = 'file-size';
    size.textContent = formatFileSize(file.size);
    
    const removeBtn = document.createElement('i');
    removeBtn.className = 'fas fa-times remove-file';
    removeBtn.onclick = () => removeFile(file, fileItem);
    
    fileItem.appendChild(icon);
    fileItem.appendChild(name);
    fileItem.appendChild(size);
    fileItem.appendChild(removeBtn);
    fileList.appendChild(fileItem);
}

function removeFile(file, element) {
    selectedFiles = selectedFiles.filter(f => f.name !== file.name);
    element.remove();
    updateFileCounter();
}

function getFileIcon(fileType) {
    if (fileType.startsWith('image/')) return 'fas fa-image';
    if (fileType === 'application/pdf') return 'fas fa-file-pdf';
    if (fileType === 'application/illustrator' || fileType === 'application/x-illustrator') return 'fas fa-file-vector';
    return 'fas fa-file';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function updateFileCounter() {
    fileCounter.textContent = `${selectedFiles.length}/${MAX_FILES} files`;
    
    // Update counter color based on number of files
    if (selectedFiles.length === MAX_FILES) {
        fileCounter.style.color = 'var(--logo-orange)';
    } else {
        fileCounter.style.color = 'var(--text-color)';
        fileCounter.style.opacity = '0.7';
    }
}

// Update form submission to use Web3Forms
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    
    // Add files to FormData
    selectedFiles.forEach((file, index) => {
        formData.append(`attachment${index + 1}`, file);
    });

    try {
        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Thank you for your message! We will get back to you within 24-48 hours.', 'success');
            contactForm.reset();
            selectedFiles = [];
            fileList.innerHTML = '';
            updateFileCounter();
        } else {
            showMessage(`Failed to send message: ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('An error occurred. Please try again later.', 'error');
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
const galleryImages = document.querySelectorAll('.gallery-item img');
let currentImageIndex = 0;

// Open lightbox
galleryImages.forEach((img, index) => {
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
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
});

nextButton.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') {
        closeLightboxView();
    } else if (e.key === 'ArrowLeft') {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    } else if (e.key === 'ArrowRight') {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
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
    const img = galleryImages[currentImageIndex];
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
} 