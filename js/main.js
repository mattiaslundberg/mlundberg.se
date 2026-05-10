/**
 * Main JavaScript for Portfolio Website
 * Handles navigation, scroll animations, and interactive features
 */

(function() {
  'use strict';

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    setupNavigation();
    setupScrollAnimations();
    setupSmoothScroll();
    setupCurrentYear();
    setupMobileMenu();
    setupLazyLoading();
  }

  /**
   * Navigation Setup
   */
  function setupNavigation() {
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
      updateActiveNavLink(navLinks);
      updateNavBackground(nav);
    });

    // Handle nav link clicks
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId.startsWith('#')) {
          scrollToSection(targetId);
          closeMobileMenu();
        }
      });
    });
  }

  /**
   * Update active navigation link based on scroll position
   */
  function updateActiveNavLink(navLinks) {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /**
   * Update navigation background on scroll
   */
  function updateNavBackground(nav) {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  /**
   * Smooth scroll to section
   */
  function scrollToSection(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const navHeight = document.querySelector('.main-nav').offsetHeight;
      const targetPosition = targetElement.offsetTop - navHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }

  /**
   * Setup smooth scroll for anchor links
   */
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
          e.preventDefault();
          scrollToSection(href);
        }
      });
    });
  }

  /**
   * Setup scroll animations using Intersection Observer
   */
  function setupScrollAnimations() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Remove animation classes and show content immediately
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.classList.add('animated');
      });
      return;
    }

    // Create Intersection Observer
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          // Add slide-up animation
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.opacity = '1';
          
          // Stop observing once animated
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el, index) => {
      // Add initial styles
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      
      // Add delay classes for staggered animations
      if (index > 0 && index % 2 === 0) {
        el.classList.add('animate-delay-2');
      } else if (index > 0) {
        el.classList.add('animate-delay-1');
      }
      
      observer.observe(el);
    });

    // Observe sections for fade-in
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.classList.add('animate-on-scroll');
      observer.observe(section);
    });
  }

  /**
   * Setup mobile menu toggle
   */
  function setupMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.setAttribute('aria-expanded', !isExpanded);
        
        // Toggle menu visibility
        if (isExpanded) {
          navMenu.style.maxHeight = '0';
        } else {
          navMenu.style.maxHeight = '500px';
        }
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
          navToggle.setAttribute('aria-expanded', 'false');
          navMenu.setAttribute('aria-expanded', 'false');
          navMenu.style.maxHeight = '0';
        }
      });

      // Close menu on window resize if it becomes desktop size
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
          navToggle.setAttribute('aria-expanded', 'false');
          navMenu.setAttribute('aria-expanded', 'false');
          navMenu.style.maxHeight = '';
        }
      });
    }
  }

  /**
   * Close mobile menu
   */
  function closeMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.setAttribute('aria-expanded', 'false');
      navMenu.style.maxHeight = '0';
    }
  }

  /**
   * Set current year in footer
   */
  function setupCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear();
    }
  }

  /**
   * Handle keyboard navigation
   */
  document.addEventListener('keydown', (e) => {
    // Close mobile menu on Escape key
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  /**
   * Add focus indicators for keyboard navigation
   */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });

  /**
   * Setup lazy loading for images
   */
  function setupLazyLoading() {
    // Check if browser supports native lazy loading
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading is supported
      const images = document.querySelectorAll('img[data-src]');
      images.forEach(img => {
        img.src = img.dataset.src;
        img.loading = 'lazy';
      });
    } else {
      // Fallback: Use Intersection Observer for lazy loading
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            observer.unobserve(img);
          }
        });
      });

      const lazyImages = document.querySelectorAll('img[data-src]');
      lazyImages.forEach(img => imageObserver.observe(img));
    }
  }

})();
