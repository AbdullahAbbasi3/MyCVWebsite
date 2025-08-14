// Abdullah Abbasi Portfolio Website JavaScript

class PortfolioApp {
  constructor() {
    this.canvas = document.getElementById('background-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.shapes = [];
    this.animationId = null;
    this.resizeTimeout = null;
    
    this.init();
  }

  init() {
    this.setupCanvas();
    this.createShapes();
    this.setupIntersectionObserver();
    this.setupSmoothScrolling();
    this.setupNavigation();
    this.setupContactLinks();
    this.startAnimation();
    
    // Setup event listeners
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  setupCanvas() {
    this.resizeCanvas();
    // Ensure canvas is positioned correctly
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.zIndex = '-1';
    this.canvas.style.pointerEvents = 'none';
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createShapes() {
    this.shapes = [];
    const numShapes = Math.min(14, Math.max(8, Math.floor(window.innerWidth / 140)));
    
    const vibrantColors = [
      // Bright blues
      '#3B82F6', '#60A5FA', '#93C5FD',
      // Vibrant greens  
      '#10B981', '#34D399', '#6EE7B7',
      // Warm purples
      '#8B5CF6', '#A78BFA', '#C4B5FD',
      // Soft pinks
      '#F472B6', '#FB7185', '#FDA4AF',
      // Bright oranges
      '#F97316', '#FB923C', '#FDBA74',
      // Yellow accents
      '#F59E0B', '#FBBF24', '#FCD34D'
    ];
    
    for (let i = 0; i < numShapes; i++) {
      this.shapes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 180 + 120,
        speedX: (Math.random() - 0.5) * 0.8,
        speedY: (Math.random() - 0.5) * 0.8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: vibrantColors[Math.floor(Math.random() * vibrantColors.length)],
        opacity: Math.random() * 0.6 + 0.4,
        pulseSpeed: Math.random() * 0.03 + 0.02,
        pulsePhase: Math.random() * Math.PI * 2,
        morphSpeed: Math.random() * 0.015 + 0.01
      });
    }
  }

  drawShape(shape) {
    this.ctx.save();
    
    // Update pulse effect
    const pulse = Math.sin(Date.now() * shape.pulseSpeed + shape.pulsePhase) * 0.5 + 1;
    const morphOffset = Math.sin(Date.now() * shape.morphSpeed) * 0.4;
    const currentSize = shape.size * pulse;
    
    // Create vibrant gradient
    const gradient = this.ctx.createRadialGradient(
      shape.x, shape.y, 0,
      shape.x, shape.y, currentSize * 1.5
    );
    
    // Convert hex to rgba
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    };
    
    const rgb = hexToRgb(shape.color);
    if (rgb) {
      gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shape.opacity})`);
      gradient.addColorStop(0.3, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shape.opacity * 0.8})`);
      gradient.addColorStop(0.7, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${shape.opacity * 0.4})`);
      gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);
    }
    
    // Apply blur effect for dreamy appearance
    this.ctx.filter = 'blur(50px)';
    this.ctx.globalAlpha = shape.opacity;
    
    // Draw organic blob shape
    this.ctx.translate(shape.x, shape.y);
    this.ctx.rotate(shape.rotation);
    this.ctx.fillStyle = gradient;
    
    this.ctx.beginPath();
    const points = 20;
    
    for (let i = 0; i <= points; i++) {
      const angle = (i / points) * Math.PI * 2;
      const radiusVariation = 0.5 + 0.5 * Math.sin(angle * 4 + shape.rotation * 3 + morphOffset);
      const radius = currentSize * radiusVariation;
      
      // Add organic noise
      const noise = Math.sin(angle * 8 + Date.now() * 0.002) * 0.15;
      const finalRadius = radius * (1 + noise);
      
      const x = Math.cos(angle) * finalRadius;
      const y = Math.sin(angle) * finalRadius;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }
    
    this.ctx.closePath();
    this.ctx.fill();
    
    this.ctx.restore();
  }

  updateShapes() {
    this.shapes.forEach(shape => {
      // Update position
      shape.x += shape.speedX;
      shape.y += shape.speedY;
      shape.rotation += shape.rotationSpeed;
      
      // Wrap around screen with padding
      const padding = shape.size;
      if (shape.x > this.canvas.width + padding) {
        shape.x = -padding;
      } else if (shape.x < -padding) {
        shape.x = this.canvas.width + padding;
      }
      
      if (shape.y > this.canvas.height + padding) {
        shape.y = -padding;
      } else if (shape.y < -padding) {
        shape.y = this.canvas.height + padding;
      }
    });
  }

  animate() {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Draw static shapes
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.shapes.forEach(shape => {
        this.drawShape(shape);
      });
      return;
    }
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw shapes
    this.updateShapes();
    this.shapes.forEach(shape => this.drawShape(shape));
    
    // Continue animation
    this.animationId = requestAnimationFrame(this.animate.bind(this));
  }

  startAnimation() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.animate();
  }

  setupContactLinks() {
    // Setup email link
    const emailLinks = document.querySelectorAll('a[href*="abdullahabbasi252@gmail.com"]');
    emailLinks.forEach(link => {
      link.href = 'mailto:abdullahabbasi252@gmail.com';
      link.target = '_blank';
    });

    // Setup phone link
    const phoneLinks = document.querySelectorAll('a[href*="+447562162834"]');
    phoneLinks.forEach(link => {
      link.href = 'tel:+447562162834';
    });

    // Setup LinkedIn link
    const linkedinLinks = document.querySelectorAll('a[href*="linkedin.com/in/abdullahabbasipm"]');
    linkedinLinks.forEach(link => {
      link.href = 'https://linkedin.com/in/abdullahabbasipm';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.delay) || 0;
          
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });
  }

  setupSmoothScrolling() {
    // Handle anchor links with proper smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          const headerHeight = document.querySelector('.nav').offsetHeight || 80;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
          });
          
          // Update URL
          history.pushState(null, null, `#${targetId}`);
          
          // Update active nav link immediately
          this.updateActiveNavLink();
        }
      });
    });
  }

  updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 150;
    
    let currentSection = 'home'; // default to home
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = sectionId;
      }
    });
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  setupNavigation() {
    const nav = document.querySelector('.nav');
    
    // Handle scroll for nav background and active links
    const handleNavScroll = () => {
      if (nav) {
        if (window.scrollY > 50) {
          nav.style.background = 'rgba(252, 252, 249, 0.95)';
          nav.style.backdropFilter = 'blur(20px)';
        } else {
          nav.style.background = 'rgba(252, 252, 249, 0.9)';
          nav.style.backdropFilter = 'blur(10px)';
        }
      }
      
      this.updateActiveNavLink();
    };
    
    window.addEventListener('scroll', handleNavScroll);
    this.updateActiveNavLink();
  }

  handleResize() {
    // Debounce resize events
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.resizeCanvas();
      this.createShapes();
    }, 250);
  }

  handleScroll() {
    // Additional scroll handling if needed
  }
}

// Utility functions
const utils = {
  throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
};

// Enhanced interactions with proper hover effects
class InteractionEnhancer {
  constructor() {
    this.setupNavHovers();
    this.setupHighlightCards();
    this.setupSkillCards();
    this.setupCertificationCards();
    this.setupContactLinks();
    this.setupScrollIndicator();
    this.setupToolHovers();
  }

  setupNavHovers() {
    // Add hover effects to navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.color = 'var(--color-primary)';
        link.style.transform = 'translateY(-1px)';
      });
      
      link.addEventListener('mouseleave', () => {
        if (!link.classList.contains('active')) {
          link.style.color = 'var(--color-text-secondary)';
          link.style.transform = 'translateY(0)';
        }
      });
    });
  }

  setupHighlightCards() {
    const cards = document.querySelectorAll('.highlight-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        card.style.transform = 'translateY(-6px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
        card.style.borderColor = 'var(--color-primary)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = 'var(--shadow-sm)';
        card.style.borderColor = 'var(--color-card-border)';
      });
    });
  }

  setupSkillCards() {
    const cards = document.querySelectorAll('.skill-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-6px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(33, 128, 141, 0.2)';
        card.style.borderColor = 'var(--color-primary)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = 'var(--shadow-sm)';
        card.style.borderColor = 'var(--color-card-border)';
      });
    });
  }

  setupCertificationCards() {
    const cards = document.querySelectorAll('.certification-card');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-6px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(33, 128, 141, 0.2)';
        card.style.borderColor = 'var(--color-primary)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = 'var(--shadow-sm)';
        card.style.borderColor = 'var(--color-card-border)';
      });
    });
  }

  setupContactLinks() {
    document.querySelectorAll('.contact-link').forEach(link => {
      link.addEventListener('mouseenter', () => {
        link.style.transform = 'scale(1.05) translateY(-2px)';
        link.style.boxShadow = '0 8px 25px rgba(33, 128, 141, 0.4)';
      });
      
      link.addEventListener('mouseleave', () => {
        link.style.transform = 'scale(1) translateY(0)';
        link.style.boxShadow = '';
      });
    });
  }

  setupToolHovers() {
    document.querySelectorAll('.tool, .module, .subject').forEach(item => {
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-2px) scale(1.05)';
        item.style.boxShadow = '0 4px 12px rgba(33, 128, 141, 0.3)';
        item.style.background = 'var(--color-primary)';
        item.style.color = 'var(--color-btn-primary-text)';
      });
      
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
        item.style.boxShadow = '';
        item.style.background = '';
        item.style.color = '';
      });
    });
  }

  setupScrollIndicator() {
    // Create vibrant scroll progress indicator
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 4px;
      background: linear-gradient(90deg, #3B82F6, #8B5CF6, #F472B6, #10B981, #F59E0B);
      z-index: 9999;
      transition: width 0.1s ease;
      width: 0%;
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
    `;
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', utils.throttle(() => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      indicator.style.width = `${Math.min(Math.max(scrolled, 0), 100)}%`;
    }, 10));
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize main app
  window.portfolioApp = new PortfolioApp();
  
  // Initialize interaction enhancer
  const interactions = new InteractionEnhancer();
  
  // Add loading animation
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.8s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);
  
  // Force canvas animation to start
  setTimeout(() => {
    if (window.portfolioApp) {
      window.portfolioApp.startAnimation();
    }
  }, 300);
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (window.portfolioApp && window.portfolioApp.animationId) {
      cancelAnimationFrame(window.portfolioApp.animationId);
    }
  } else {
    if (window.portfolioApp) {
      window.portfolioApp.startAnimation();
    }
  }
});

// Export for global access
window.PortfolioApp = PortfolioApp;