// ===== DOM READY =====
document.addEventListener('DOMContentLoaded', function() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Initialize all components
    initLoadingScreen();
    initThemeToggle(prefersReducedMotion);
    initNavigation(prefersReducedMotion);
    initAnimations(prefersReducedMotion);
    initCounters(prefersReducedMotion);
    initContactForm();
    initCopyButtons();
    initBackToTop(prefersReducedMotion);
    initCurrentYear();
    initTypingEffect(prefersReducedMotion);
    initToastSystem();
    initPerformanceOptimizations();
    
    // Dispatch loaded event
    setTimeout(() => {
        document.dispatchEvent(new Event('pageLoaded'));
    }, 100);
});

// ===== LOADING SCREEN =====
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    // Hide loading screen after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('loaded');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 500);
    });
    
    // Fallback in case load event doesn't fire
    setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('loaded')) {
            loadingScreen.classList.add('loaded');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }, 2000);
}

// ===== THEME TOGGLE =====
function initThemeToggle(reducedMotion) {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;
    
    if (!themeToggle) return;
    
    // Load saved theme from localStorage or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    html.setAttribute('data-theme', initialTheme);
    
    // Update button icon based on current theme
    updateThemeIcon(initialTheme);
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Set new theme
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update button icon with reduced motion option
        if (reducedMotion) {
            updateThemeIcon(newTheme);
        } else {
            // Smooth transition for users who don't prefer reduced motion
            requestAnimationFrame(() => {
                updateThemeIcon(newTheme);
            });
        }
        
        // Show toast notification
        showToast(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`);
    });
    
    function updateThemeIcon(theme) {
        const icons = themeToggle.querySelectorAll('i');
        if (theme === 'dark') {
            icons[0].style.opacity = '0';
            icons[0].style.transform = 'translateY(-100%) rotate(180deg)';
            icons[1].style.opacity = '1';
            icons[1].style.transform = 'translateY(0) rotate(0deg)';
        } else {
            icons[0].style.opacity = '1';
            icons[0].style.transform = 'translateY(0) rotate(0deg)';
            icons[1].style.opacity = '0';
            icons[1].style.transform = 'translateY(100%) rotate(-180deg)';
        }
    }
}

// ===== NAVIGATION =====
function initNavigation(reducedMotion) {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    if (!menuToggle || !navMenu) return;

    // Mobile menu toggle
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Close menu
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Get target section
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Smooth scroll with reduced motion option
                if (reducedMotion) {
                    window.scrollTo(0, targetPosition);
                } else {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Update active link on scroll with debounce
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Debounced scroll handler for performance
    let scrollTimeout;
    function debouncedUpdateActiveLink() {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(updateActiveLink);
    }
    
    window.addEventListener('scroll', debouncedUpdateActiveLink);

    // Hide/show header on scroll with throttle
    let lastScrollTop = 0;
    let ticking = false;
    
    function updateHeaderVisibility() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            if (scrollTop > lastScrollTop) {
                // Scrolling down
                header.classList.add('hidden');
            } else {
                // Scrolling up
                header.classList.remove('hidden');
            }
        } else {
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateHeaderVisibility);
            ticking = true;
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== ANIMATIONS =====
function initAnimations(reducedMotion) {
    if (reducedMotion) {
        // Disable all animations for users who prefer reduced motion
        document.body.classList.add('reduced-motion');
        return;
    }
    
    // Only run animations on larger screens
    if (window.innerWidth <= 768) {
        return;
    }
    
    const animateElements = document.querySelectorAll('.animate-slide-up, .animate-fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = getComputedStyle(entry.target).getPropertyValue('--delay') || '0';
                entry.target.style.animationDelay = delay;
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// ===== ANIMATED COUNTERS =====
function initCounters(reducedMotion) {
    const counters = document.querySelectorAll('.count-animate, .age-counter');
    
    if (reducedMotion || window.innerWidth <= 768) {
        // Show final values immediately
        counters.forEach(counter => {
            const target = counter.getAttribute('data-target');
            counter.textContent = target;
            if (counter.classList.contains('count-animate')) {
                counter.textContent = target + '+';
            }
        });
        return;
    }
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                
                animateCounter(counter, target);
                observer.unobserve(counter);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
    
    function animateCounter(element, target) {
        const duration = 1500;
        const startTime = Date.now();
        
        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic for smooth deceleration
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeProgress * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                if (element.classList.contains('count-animate')) {
                    element.textContent = target + '+';
                }
            }
        }
        
        requestAnimationFrame(update);
    }
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        // Validate form
        if (!validateForm(this)) {
            showToast('Please fill all required fields correctly', 'error');
            return;
        }
        
        // Show loading state
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        try {
            // Simulate API call (replace with actual API endpoint)
            await simulateApiCall(formData);
            
            // Show success message
            showToast('Message sent successfully! I\'ll get back to you soon.');
            
            // Reset form
            this.reset();
        } catch (error) {
            console.error('Error:', error);
            showToast('Oops! Something went wrong. Please try again.', 'error');
        } finally {
            // Reset button
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 2000);
        }
    });
    
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                isValid = false;
            } else {
                input.classList.remove('error');
            }
            
            // Email validation
            if (input.type === 'email' && input.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value.trim())) {
                    input.classList.add('error');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    async function simulateApiCall(formData) {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Form submitted successfully'
                });
            }, 1500);
        });
    }
    
    // Add error styling to invalid inputs
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('error');
        });
    });
}

// ===== COPY BUTTONS =====
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');
    
    if (!copyButtons.length) return;
    
    copyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const text = this.getAttribute('data-clipboard');
            
            if (!text) return;
            
            try {
                await navigator.clipboard.writeText(text);
                
                const originalIcon = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i>';
                this.style.color = '#28a745';
                
                showToast('Copied to clipboard!');
                
                setTimeout(() => {
                    this.innerHTML = originalIcon;
                    this.style.color = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
                
                // Fallback for browsers that don't support clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    showToast('Copied to clipboard!');
                } catch (fallbackErr) {
                    console.error('Fallback copy failed: ', fallbackErr);
                    showToast('Failed to copy to clipboard', 'error');
                }
                
                document.body.removeChild(textArea);
            }
        });
    });
}

// ===== BACK TO TOP =====
function initBackToTop(reducedMotion) {
    const backToTop = document.getElementById('backToTop');
    
    if (!backToTop) return;
    
    // Show/hide button on scroll with throttle
    let ticking = false;
    
    function updateBackToTop() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateBackToTop);
            ticking = true;
        }
    });
    
    // Scroll to top when clicked
    backToTop.addEventListener('click', function() {
        if (reducedMotion) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
}

// ===== CURRENT YEAR =====
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== TYPING EFFECT =====
function initTypingEffect(reducedMotion) {
    if (reducedMotion || window.innerWidth <= 768) {
        // Disable typing effect on mobile and for reduced motion
        const typingElements = document.querySelectorAll('.typing-text');
        typingElements.forEach(element => {
            element.style.animation = 'none';
            element.style.width = 'auto';
            element.style.borderRight = 'none';
        });
        return;
    }
    
    const typingElements = document.querySelectorAll('.typing-text');
    
    typingElements.forEach((element, index) => {
        const text = element.textContent;
        element.textContent = '';
        element.style.display = 'inline-block';
        element.style.overflow = 'hidden';
        element.style.whiteSpace = 'nowrap';
        element.style.borderRight = '2px solid currentColor';
        element.style.width = '0';
        
        // Stagger the typing animations
        setTimeout(() => {
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    element.style.width = (i + 1) + 'ch';
                    i++;
                    setTimeout(typeWriter, 100);
                } else {
                    element.style.borderRight = 'none';
                }
            };
            typeWriter();
        }, index * 500);
    });
}

// ===== TOAST NOTIFICATION SYSTEM =====
function initToastSystem() {
    // Create toast container if it doesn't exist
    if (!document.getElementById('toast')) {
        const toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    
    if (!toast) return;
    
    // Clear existing timeout
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }
    
    // Set message and type
    toast.textContent = message;
    toast.className = 'toast';
    
    // Show toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    toast.timeoutId = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initPerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Preconnect to external domains
    const preconnectLinks = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://cdnjs.cloudflare.com'
    ];
    
    preconnectLinks.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
    
    // Optimize scroll performance
    let scrollTimeout;
    function handleScroll() {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = requestAnimationFrame(() => {
            // Update any scroll-dependent elements here
        });
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Optimize resize performance
    let resizeTimeout;
    function handleResize() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        
        resizeTimeout = setTimeout(() => {
            // Update any resize-dependent elements here
        }, 100);
    }
    
    window.addEventListener('resize', handleResize, { passive: true });
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Only show toast for critical errors
    if (e.error && e.error.message && e.error.message.includes('critical')) {
        showToast('An error occurred. Please refresh the page.', 'error');
    }
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (menuToggle && navMenu && navMenu.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // 't' key toggles theme (only when not in input)
    if (e.key === 't' && !e.ctrlKey && !e.altKey && !e.metaKey && 
        e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.click();
        }
    }
});

// ===== TOUCH DEVICE DETECTION =====
function isTouchDevice() {
    return 'ontouchstart' in window || 
           navigator.maxTouchPoints > 0 || 
           navigator.msMaxTouchPoints > 0;
}

if (isTouchDevice()) {
    document.body.classList.add('touch-device');
}

// ===== SERVICE WORKER REGISTRATION (OPTIONAL) =====
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }).catch(function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// ===== OFFLINE DETECTION =====
window.addEventListener('online', function() {
    showToast('Back online!');
});

window.addEventListener('offline', function() {
    showToast('You are offline. Some features may be unavailable.', 'error');
});

// ===== ADD CSS FOR FORM ERRORS =====
const errorStyles = document.createElement('style');
errorStyles.textContent = `
    .input-icon input.error,
    .input-icon textarea.error {
        border-color: #dc3545 !important;
    }
    
    .input-icon input.error + i,
    .input-icon textarea.error + i {
        color: #dc3545 !important;
    }
    
    @media (prefers-reduced-motion: reduce) {
        .reduced-motion * {
            animation: none !important;
            transition: none !important;
        }
    }
`;
document.head.appendChild(errorStyles);

// ===== WHATSAPP DIRECT MESSAGE =====
function initWhatsAppDirect() {
    const whatsappBtn = document.querySelector('a[href*="wa.me"]');
    
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
            // Add confirmation for WhatsApp
            if (!confirm('Open WhatsApp to send a message?')) {
                e.preventDefault();
            }
        });
    }
}

// Initialize in DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    initWhatsAppDirect();
    // ... existing code ...
});

// ===== SOCIAL MEDIA ANALYTICS (Optional) =====
function trackSocialClicks() {
    const socialLinks = document.querySelectorAll('.social-icon');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const platform = this.getAttribute('title');
            console.log(`Social media clicked: ${platform}`);
            
            // You can add Google Analytics or other tracking here
            // Example: gtag('event', 'social_click', { platform: platform });
        });
    });
}

// Initialize in DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...
    trackSocialClicks();
    // ... existing code ...
});
