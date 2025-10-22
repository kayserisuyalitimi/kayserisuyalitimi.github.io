// ========== Main JavaScript File ==========

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ========== App Initialization ==========
function initializeApp() {
    // Initialize all components
    initLoader();
    initNavigation();
    initAnimations();
    initCounters();
    initTestimonials();
    initSmoothScroll();
    initMobileMenu();
    initIntersectionObserver();
    initParallax();
    initFormValidation();
    
    // Performance monitoring
    console.log('Kahraman Su Yalıtımı - Website loaded successfully!');
}

// ========== Loading Screen ==========
function initLoader() {
    const loadingScreen = document.querySelector('.loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    if (!loadingScreen || !loadingProgress) return;
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15;
        
        if (progress >= 100) {
            progress = 100;
            loadingProgress.style.width = '100%';
            
            setTimeout(() => {
                loadingScreen.classList.add('hide');
                document.body.classList.remove('no-scroll');
                
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 500);
            
            clearInterval(loadingInterval);
        } else {
            loadingProgress.style.width = progress + '%';
        }
    }, 50);
    
    // Fallback: Remove loading screen after 3 seconds maximum
    setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('hide')) {
            loadingScreen.classList.add('hide');
            document.body.classList.remove('no-scroll');
            
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }
    }, 3000);
}

// ========== Navigation ==========
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!navbar) return;
    
    // Scroll effect for navigation
    let lastScrollTop = 0;
    const scrollThreshold = 100;
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class
        if (scrollTop > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active navigation link
        updateActiveNavLink();
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, 16));
    
    // Navigation link clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle anchor links, not external pages
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                
                if (targetElement) {
                    smoothScrollTo(targetElement, 80); // 80px offset for navbar
                }
            }
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollPos = window.pageYOffset + 120;
    
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute('id');
        
        if (scrollPos >= top && scrollPos <= bottom) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + id) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// ========== Mobile Menu ==========
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!hamburger || !navMenu) return;
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    });
    
    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

// ========== Smooth Scrolling ==========
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                smoothScrollTo(targetElement, 80);
            }
        });
    });
}

function smoothScrollTo(element, offset = 0) {
    const elementPosition = element.offsetTop - offset;
    const startPosition = window.pageYOffset;
    const distance = elementPosition - startPosition;
    const duration = Math.abs(distance) / 3; // Adjust speed
    let start = null;
    
    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        
        window.scrollTo(0, run);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

// ========== Counter Animation ==========
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Animation speed
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / speed;
        let count = 0;
        
        const updateCount = () => {
            if (count < target) {
                count += increment;
                counter.innerText = Math.ceil(count);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.7 });
        
        observer.observe(counter);
    });
}

// ========== Testimonials Slider ==========
function initTestimonials() {
    const testimonialItems = document.querySelectorAll('.testimonial-item');
    let currentTestimonial = 0;
    
    if (testimonialItems.length === 0) return;
    
    function showTestimonial(index) {
        testimonialItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialItems.length;
        showTestimonial(currentTestimonial);
    }
    
    // Auto-rotate testimonials every 5 seconds
    setInterval(nextTestimonial, 5000);
    
    // Initialize first testimonial
    showTestimonial(0);
}

// ========== Scroll Animations ==========
function initAnimations() {
    // Add animation classes to elements
    const animatedElements = document.querySelectorAll(
        '.service-card, .why-us-item, .process-step, .stat-item, .visual-card'
    );
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(50px)';
        element.style.transition = 'all 0.6s ease-out';
        element.style.transitionDelay = `${index * 0.1}s`;
    });
}

// ========== Intersection Observer ==========
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add visible class for additional animations
                entry.target.classList.add('visible');
                
                // Unobserve the element after animation
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const elementsToObserve = document.querySelectorAll(
        '.service-card, .why-us-item, .process-step, .stat-item, .visual-card, .section-header'
    );
    
    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
}

// ========== Parallax Effect ==========
function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-bg, .floating-particles');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset;
        const scrolled = scrollTop * 0.5;
        
        parallaxElements.forEach(element => {
            if (element.classList.contains('hero-bg')) {
                element.style.transform = `translateY(${scrolled}px)`;
            } else if (element.classList.contains('floating-particles')) {
                element.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }, 16));
}

// ========== Form Validation ==========
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const formFields = form.querySelectorAll('input, textarea, select');
            let isValid = true;
            
            // Basic validation
            formFields.forEach(field => {
                const value = field.value.trim();
                const fieldType = field.type;
                
                // Remove previous error styling
                field.classList.remove('error');
                
                // Required field validation
                if (field.hasAttribute('required') && !value) {
                    field.classList.add('error');
                    isValid = false;
                    showFieldError(field, 'Bu alan zorunludur.');
                }
                
                // Email validation
                if (fieldType === 'email' && value && !isValidEmail(value)) {
                    field.classList.add('error');
                    isValid = false;
                    showFieldError(field, 'Geçerli bir e-posta adresi girin.');
                }
                
                // Phone validation
                if (fieldType === 'tel' && value && !isValidPhone(value)) {
                    field.classList.add('error');
                    isValid = false;
                    showFieldError(field, 'Geçerli bir telefon numarası girin.');
                }
            });
            
            if (isValid) {
                // Form is valid, show success message
                showFormSuccess(form);
                form.reset();
            }
        });
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function showFieldError(field, message) {
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message element
    const errorElement = document.createElement('span');
    errorElement.classList.add('error-message');
    errorElement.textContent = message;
    errorElement.style.color = '#dc2626';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.display = 'block';
    errorElement.style.marginTop = '0.25rem';
    
    // Insert error message after the field
    field.parentNode.insertBefore(errorElement, field.nextSibling);
    
    // Remove error after 5 seconds
    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.remove();
        }
    }, 5000);
}

function showFormSuccess(form) {
    // Create success message
    const successElement = document.createElement('div');
    successElement.classList.add('success-message');
    successElement.innerHTML = `
        <div style="background: #059669; color: white; padding: 1rem; border-radius: 0.5rem; margin-top: 1rem; text-align: center;">
            <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
            Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.
        </div>
    `;
    
    // Insert success message after form
    form.parentNode.insertBefore(successElement, form.nextSibling);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        if (successElement.parentNode) {
            successElement.remove();
        }
    }, 5000);
    
    // Scroll to success message
    successElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ========== Gallery Functionality ==========
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (filter === 'all' || itemCategory === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Lightbox functionality
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            const imgAlt = this.querySelector('img').alt;
            
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
            lightbox.classList.add('active');
            document.body.classList.add('no-scroll');
        });
    });
    
    // Close lightbox
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }
    
    // Close lightbox on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }
    
    // Close lightbox on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }
    });
}

// ========== Utility Functions ==========

// Throttle function for performance optimization
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Get element offset
function getOffset(element) {
    const rect = element.getBoundingClientRect();
    return {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// ========== Additional Features ==========

// Page visibility API for performance optimization
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause animations
        document.body.classList.add('page-hidden');
    } else {
        // Page is visible, resume animations
        document.body.classList.remove('page-hidden');
    }
});

// Resize handler with debouncing
window.addEventListener('resize', debounce(function() {
    // Handle responsive adjustments
    updateLayout();
}, 250));

function updateLayout() {
    // Update any layout calculations that depend on viewport size
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isDesktop = window.innerWidth >= 1024;
    
    // Add responsive classes to body
    document.body.classList.toggle('is-mobile', isMobile);
    document.body.classList.toggle('is-tablet', isTablet);
    document.body.classList.toggle('is-desktop', isDesktop);
}

// Initialize layout on load
updateLayout();

// ========== Error Handling ==========
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send error reports to analytics here
});

// Performance monitoring
window.addEventListener('load', function() {
    // Check page load performance
    if (performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`Page load time: ${loadTime}ms`);
        
        // Log performance metrics
        if (loadTime > 3000) {
            console.warn('Page load time is over 3 seconds');
        }
    }
});

// ========== Service Worker Registration (Optional) ==========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}


// ========== Page Transition / Link Intercept ==========
(function(){
  const isSameOrigin = (url) => {
    try {
      const u = new URL(url, window.location.href);
      return u.origin === window.location.origin;
    } catch(e) { return false; }
  };
  document.addEventListener('click', function(e){
    const a = e.target.closest('a');
    if(!a) return;
    // Ignore if external, target=_blank or modifier keys
    if (!isSameOrigin(a.href) || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    // Only intercept html navigations
    if (!/\.html($|\?)/i.test(a.getAttribute('href'))) return;
    e.preventDefault();
    const loader = document.querySelector('.loading-screen');
    if (loader) {
      loader.classList.remove('hide');
      document.body.classList.add('no-scroll');
      setTimeout(() => { window.location.href = a.href; }, 200);
    } else {
      window.location.href = a.href;
    }
  }, true);

  // Show loader on back/forward navigations
  window.addEventListener('pageshow', function(ev){
    const loader = document.querySelector('.loading-screen');
    if (loader) loader.classList.add('hide');
  });
})();
