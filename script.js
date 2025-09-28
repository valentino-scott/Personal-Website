// === DOM Elements ===
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const footerThemeToggle = document.getElementById('footer-theme-toggle');
const contactForm = document.getElementById('contact-form');
const currentDateElement = document.getElementById('current-date');
const rotatingQuote = document.getElementById('rotating-quote');
const downloadCV = document.getElementById('download-cv');
const hackerMode = document.getElementById('hacker-mode');

// === Theme Manager ===
class ThemeManager {
    constructor() {
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.bindToggleEvents();
    }

    bindToggleEvents() {
        [themeToggle, footerThemeToggle].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => this.toggleTheme());
            }
        });
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    }
}

// === Navigation Manager (as before) ===
class NavigationManager {
    constructor() {
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => this.toggleMenu());
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                if (targetId) {
                    this.scrollToSection(targetId);
                    this.closeMenu();
                }
            });
        });

        window.addEventListener('scroll', () => this.handleScroll());

        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && navMenu && hamburger &&
                !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        navMenu?.classList.toggle('active', this.isMenuOpen);
        hamburger?.classList.toggle('active', this.isMenuOpen);
    }

    closeMenu() {
        this.isMenuOpen = false;
        navMenu?.classList.remove('active');
        hamburger?.classList.remove('active');
    }

    scrollToSection(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    }

    handleScroll() {
        const scrollY = window.scrollY;
        navbar?.classList.toggle('scrolled', scrollY > 50);
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
        });
    }
}

// === Utility Manager ===
class UtilityManager {
    constructor() {
        this.matrixInterval = null;
        this.init();
    }

    init() {
        this.updateCurrentDate();
        this.initRotatingQuotes();
        this.bindUtilityEvents();
    }

    updateCurrentDate() {
        if (currentDateElement) {
            const now = new Date();
            currentDateElement.textContent = now.toDateString();
        }
    }

    initRotatingQuotes() {
        if (!rotatingQuote) return;
        const quotes = [
            "Code is like humor. When you have to explain it, it’s bad.",
            "Talk is cheap. Show me the code.",
            "Experience is the name everyone gives to their mistakes.",
            "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
            "First, solve the problem. Then, write the code."
        ];

        let index = 0;
        rotatingQuote.textContent = quotes[index];

        setInterval(() => {
            index = (index + 1) % quotes.length;
            rotatingQuote.textContent = quotes[index];
        }, 5000);
    }

    bindUtilityEvents() {
        downloadCV?.addEventListener('click', (e) => {
            e.preventDefault();
            this.downloadFile('/assets/valentino-achira-cv.pdf', 'Valentino-Achira-CV.pdf');
        });

        hackerMode?.addEventListener('click', (e) => {
            e.preventDefault();
            this.activateHackerMode();
        });

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                window.themeManager?.toggleTheme();
            }

            if (e.key === 'Escape' && window.navigationManager?.isMenuOpen) {
                window.navigationManager.closeMenu();
            }
        });
    }

    downloadFile(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
    }

    activateHackerMode() {
        if (document.getElementById('matrix-canvas')) return;
        this.startMatrixEffect();
    }

    startMatrixEffect() {
        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        canvas.style.opacity = '0.1';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
        const matrixArray = matrix.split("");
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0F0';
            ctx.font = `${fontSize}px monospace`;

            drops.forEach((y, i) => {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, y * fontSize);
                drops[i] = (y * fontSize > canvas.height && Math.random() > 0.975) ? 0 : y + 1;
            });
        };

        this.matrixInterval = setInterval(draw, 35);
    }
}

// === Placeholder Classes for Animation & Contact ===
class AnimationManager {
    constructor() {
        // Implement scroll or entry animations as needed
    }
}
class ContactFormManager {
    constructor() {
        // Implement contact form handling
    }
}
class PerformanceMonitor {
    constructor() {
        // Implement performance stats if needed
    }
}

// === App Init ===
class App {
    constructor() {
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeApp());
        } else {
            this.initializeApp();
        }
    }

    initializeApp() {
        try {
            this.themeManager = new ThemeManager();
            this.navigationManager = new NavigationManager();
            this.animationManager = new AnimationManager();
            this.contactFormManager = new ContactFormManager();
            this.utilityManager = new UtilityManager();
            this.performanceMonitor = new PerformanceMonitor();

            // Expose for global use
            window.themeManager = this.themeManager;
            window.navigationManager = this.navigationManager;

            console.log('🚀 Portfolio application initialized successfully!');
        } catch (error) {
            console.error('❌ Error initializing application:', error);
        }
    }
}

// === Service Worker ===
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered:', reg))
            .catch(err => console.error('SW registration failed:', err));
    });
}

// === Start App ===
const app = new App();

// Optional: Export for Node/testing environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        App, ThemeManager, NavigationManager, AnimationManager,
        ContactFormManager, UtilityManager, PerformanceMonitor
    };
}
