 // Portfolio Website JavaScript - Fixed Navigation System

class PortfolioApp {
    constructor() {
        this.currentPage = 'home';
        this.navLinks = document.querySelectorAll('.nav__link');
        this.pages = document.querySelectorAll('.page');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.contactForm = document.getElementById('contact-form');

        this.init();
    }

    init() {
        this.bindEvents();
        this.setActiveNavigation();
        this.handleURLHash();
        
        // Ensure home page is visible on load
        setTimeout(() => {
            this.showPage('home');
        }, 100);
    }

    bindEvents() {
        // Navigation link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                if (page) {
                    this.navigateToPage(page);
                    this.closeMobileMenu();
                }
            });
        });

        // Handle all elements with data-page attribute (including CTA buttons)
        document.querySelectorAll('[data-page]').forEach(element => {
            element.addEventListener('click', (e) => {
                e.preventDefault();
                const page = element.getAttribute('data-page');
                if (page) {
                    this.navigateToPage(page);
                    this.closeMobileMenu();
                }
            });
        });

        // Mobile menu toggle
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav') && this.navMenu && this.navMenu.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });

        // Contact form submission
        if (this.contactForm) {
            this.contactForm.addEventListener('submit', (e) => {
                this.handleContactForm(e);
            });
        }

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleURLHash();
        });

        // Add scroll effect to header
        window.addEventListener('scroll', () => {
            this.handleHeaderScroll();
        });
    }

    navigateToPage(page) {
        if (page === this.currentPage) return;

        const pageExists = document.getElementById(page);
        if (!pageExists) {
            console.warn(`Page "${page}" not found`);
            return;
        }

        // Update current page
        this.currentPage = page;
        
        // Show the selected page
        this.showPage(page);
        
        // Update navigation
        this.setActiveNavigation();
        
        // Update URL
        this.updateURL(page);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showPage(targetPage) {
        // Hide all pages
        this.pages.forEach(page => {
            page.classList.remove('page--active');
            page.style.display = 'none';
            page.style.opacity = '0';
            page.style.transform = 'translateY(20px)';
        });

        // Show target page
        const targetElement = document.getElementById(targetPage);
        if (targetElement) {
            targetElement.style.display = 'block';
            targetElement.classList.add('page--active');
            
            // Animate in
            setTimeout(() => {
                targetElement.style.opacity = '1';
                targetElement.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    setActiveNavigation() {
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('data-page');
            if (linkPage === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    updateURL(page) {
        const newURL = page === 'home' ? '/' : `#${page}`;
        try {
            history.pushState({ page }, '', newURL);
        } catch (e) {
            // Fallback for environments where history API might not work
            window.location.hash = page === 'home' ? '' : page;
        }
    }

    handleURLHash() {
        const hash = window.location.hash.slice(1);
        const page = hash || 'home';
        
        if (document.getElementById(page)) {
            this.currentPage = page;
            this.showPage(page);
            this.setActiveNavigation();
        }
    }

    toggleMobileMenu() {
        if (this.navMenu && this.navToggle) {
            this.navMenu.classList.toggle('active');
            this.navToggle.classList.toggle('active');
            document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
        }
    }

    closeMobileMenu() {
        if (this.navMenu && this.navToggle) {
            this.navMenu.classList.remove('active');
            this.navToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    handleContactForm(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this.contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Validate form
        if (!this.validateContactForm(data)) {
            return;
        }

        // Show loading state
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            this.showMessage('Thank you! Your message has been sent successfully.', 'success');
            this.contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    }

    validateContactForm(data) {
        const errors = [];

        if (!data.name || !data.name.trim()) {
            errors.push('Name is required');
        }

        if (!data.email || !data.email.trim()) {
            errors.push('Email is required');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }

        if (!data.subject || !data.subject.trim()) {
            errors.push('Subject is required');
        }

        if (!data.message || !data.message.trim()) {
            errors.push('Message is required');
        }

        if (errors.length > 0) {
            this.showMessage(errors.join(', '), 'error');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showMessage(message, type = 'info') {
        // Remove any existing messages
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message status status--${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 1001;
            max-width: 400px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            padding: 12px 16px;
            border-radius: 8px;
            font-weight: 500;
        `;

        document.body.appendChild(messageEl);

        // Animate in
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 5 seconds
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.remove();
                }
            }, 300);
        }, 5000);
    }

    handleHeaderScroll() {
        const header = document.querySelector('.header');
        if (header) {
            if (window.scrollY > 50) {
                header.style.background = getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim() || 'rgba(252, 252, 249, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = getComputedStyle(document.documentElement).getPropertyValue('--color-surface').trim() + '95' || 'rgba(252, 252, 249, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
    }
}

// Animation utilities
class AnimationUtils {
    static fadeInOnScroll() {
        const elements = document.querySelectorAll('.education__item, .experience__item, .skill__item, .certification__item');
        
        if (window.IntersectionObserver) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            elements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease-out';
                observer.observe(el);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            elements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }
    }

    static addHoverEffects() {
        const interactiveElements = document.querySelectorAll('.education__item, .experience__item, .skill__item, .certification__item');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (el.style.transform.includes('translateY')) {
                    el.style.transform = el.style.transform.replace(/translateY\([^)]*\)/, 'translateY(-5px)');
                } else {
                    el.style.transform = 'translateY(-5px)';
                }
            });
            
            el.addEventListener('mouseleave', () => {
                if (el.style.transform.includes('translateY')) {
                    el.style.transform = el.style.transform.replace(/translateY\([^)]*\)/, 'translateY(0)');
                } else {
                    el.style.transform = 'translateY(0)';
                }
            });
        });
    }
}

// Theme manager
class ThemeManager {
    constructor() {
        this.currentTheme = this.getPreferredTheme();
        this.applyTheme();
    }

    getPreferredTheme() {
        try {
            const saved = localStorage.getItem('theme');
            if (saved) return saved;
        } catch (e) {
            // localStorage might not be available
        }
        
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    applyTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.currentTheme);
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        try {
            localStorage.setItem('theme', this.currentTheme);
        } catch (e) {
            // localStorage might not be available
        }
        this.applyTheme();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Portfolio App...');
    
    // Initialize main app
    const app = new PortfolioApp();
    
    // Initialize animations after a short delay
    setTimeout(() => {
        AnimationUtils.fadeInOnScroll();
        AnimationUtils.addHoverEffects();
    }, 500);
    
    // Initialize theme manager
    const themeManager = new ThemeManager();
    
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            app.closeMobileMenu();
        }
        
        // Add arrow key navigation
        if (e.altKey) {
            const pages = ['home', 'about', 'education', 'experience', 'skills', 'certifications', 'contact'];
            const currentIndex = pages.indexOf(app.currentPage);
            
            if (e.key === 'ArrowRight' && currentIndex < pages.length - 1) {
                e.preventDefault();
                app.navigateToPage(pages[currentIndex + 1]);
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                e.preventDefault();
                app.navigateToPage(pages[currentIndex - 1]);
            }
        }
    });

    // Add focus management for accessibility
    document.querySelectorAll('.nav__link, .btn').forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--color-primary)';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = 'none';
        });
    });

    // Performance optimization
    const observerOptions = {
        root: null,
        rootMargin: '100px',
        threshold: 0.1
    };

    if (window.IntersectionObserver) {
        const lazyLoadObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.page').forEach(section => {
            lazyLoadObserver.observe(section);
        });
    }

    // Add loading state management
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
    });

    // Add error handling
    window.addEventListener('error', (e) => {
        console.error('An error occurred:', e.error);
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled promise rejection:', e.reason);
        e.preventDefault();
    });

    console.log('Portfolio App initialized successfully!');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortfolioApp, AnimationUtils, ThemeManager };
}