/*
 * ://BP - Main Script
 *
 * A modern, responsive portfolio website with:
 * - Custom cursor interactions
 * - Smooth scroll animations
 * - Mobile-friendly bottom sheet
 *
 * @author Bhavesh Patil
 *
 */

/**
 * Wait for DOM to be fully loaded before initializing the application
 * Ensures all HTML elements are ready for manipulation
 */
document.addEventListener("DOMContentLoaded", () => {
    // Check if required external libraries are loaded
    checkLibraries();
});

/**
 * Checks if all required external libraries (GSAP, ScrollTrigger, Lenis) are loaded
 * Retries every 50ms until all libraries are available
 * Once ready, initializes the application
 */
function checkLibraries() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof Lenis !== 'undefined') {
        initializeApp();
    } else {
        // Libraries not ready yet, check again in 50ms
        setTimeout(checkLibraries, 50);
    }
}

/**
 * Initializes the main application
 * Sets up all animations, interactions, and event listeners
 *
 * Features initialized:
 * - Smooth scrolling with Lenis
 * - Preloader animation
 * - Custom cursor effects
 * - Scroll-triggered animations
 * - Interactive bottom sheet (mobile)
 * - Back to top button
 */
function initializeApp() {
    // Safety check: Exit early if core libraries aren't available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        document.querySelector('.preloader').style.display = 'none';
        return;
    }

    // Register GSAP ScrollTrigger plugin for scroll-based animations
    gsap.registerPlugin(ScrollTrigger);

    /* SMOOTH SCROLLING */

    // Initialize Lenis smooth scroll if available
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,  // Scroll duration in seconds
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),  // Easing function for natural feel
            smooth: true,
        });

        /**
         * Animation frame loop for Lenis smooth scroll
         * Continuously updates scroll position for smooth effect
         * @param {number} time - Current timestamp
         */
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Enable smooth scrolling for all anchor links (e.g., navigation links)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                lenis.scrollTo(this.getAttribute('href'));
            });
        });
    }

    /* PRELOADER ANIMATION */

    // Get preloader counter element
    const counterElement = document.querySelector(".counter");

    // Object to track loading progress (0 to 100)
    const loadProgress = {
        val: 0
    };

    // Create GSAP timeline for preloader animation
    const tlLoader = gsap.timeline();

    // Animate counter from 0 to 100%
    tlLoader.to(loadProgress, {
        val: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
            // Update counter display on each frame
            if (counterElement) {
                counterElement.textContent = Math.floor(loadProgress.val) + "%";
            }
        }
    })
    // Slide preloader up and out of view once counter reaches 100%
    .to(".preloader", {
        yPercent: -100,  // Move 100% upward (out of viewport)
        duration: 1,
        ease: "power4.inOut",
        delay: 0.2  // Small delay before sliding out
    });

    /* DOM ELEMENT REFERENCES */

    // Custom cursor elements
    const cursor = document.querySelector('.cursor');
    const cursorText = document.querySelector('.cursor-text');

    // Capability items for interactive cards
    const items = document.querySelectorAll('.capability-item');

    // Bottom sheet elements (mobile info panel)
    const bottomSheet = document.querySelector('.bottom-sheet');
    const overlay = document.querySelector('.bottom-sheet-overlay');
    const closeBtn = document.querySelector('.bottom-sheet-close');
    const bsNum = document.querySelector('.bs-num');
    const bsTitle = document.querySelector('.bs-title');
    const bsDesc = document.querySelector('.bs-desc');

    // Navigation elements
    const backToTopBtn = document.querySelector('.back-to-top');
    const heroSection = document.querySelector('.hero');

    // Track bottom sheet state
    let isBottomSheetActive = false;

    /* BOTTOM SHEET (MOBILE) */

    /**
     * Opens the bottom sheet panel with capability details
     * Only works on mobile devices (screen width <= 1024px)
     * @param {HTMLElement} item - The capability item element that was clicked
     */
    function openBottomSheet(item) {
        // Only show bottom sheet on mobile/tablet devices
        if (window.innerWidth > 1024) return;

        // Extract data from clicked capability item
        const num = item.querySelector('.capability-num').textContent;
        const name = item.querySelector('.capability-name').textContent;
        const desc = item.querySelector('.capability-desc').innerHTML;

        // Populate bottom sheet with extracted content
        bsNum.textContent = num;
        bsTitle.textContent = name;
        bsDesc.innerHTML = desc;

        // Show bottom sheet and overlay
        bottomSheet.classList.add('active');
        overlay.classList.add('active');
        isBottomSheetActive = true;

        // Hide back-to-top button when sheet is open to avoid overlap
        if (backToTopBtn) backToTopBtn.classList.remove('visible');
    }

    /**
     * Closes the bottom sheet panel
     * Restores the back-to-top button if user has scrolled down
     */
    function closeBottomSheet() {
        // Hide bottom sheet and overlay
        bottomSheet.classList.remove('active');
        overlay.classList.remove('active');
        isBottomSheetActive = false;

        // Restore back-to-top button if user has scrolled past hero section
        if (backToTopBtn) {
            const triggerHeight = heroSection ? heroSection.offsetHeight : 500;
            if (window.scrollY > triggerHeight) {
                backToTopBtn.classList.add('visible');
            }
        }
    }

    // Attach event listeners for bottom sheet interactions
    items.forEach(item => {
        item.addEventListener('click', () => openBottomSheet(item));
    });

    // Close bottom sheet when clicking overlay
    if (overlay) overlay.addEventListener('click', closeBottomSheet);

    // Close bottom sheet when clicking close button
    if (closeBtn) closeBtn.addEventListener('click', closeBottomSheet);

    /* CUSTOM CURSOR */

    if (cursor) {
        /**
         * Make cursor follow mouse position smoothly
         * Uses GSAP for smooth animation between positions
         */
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });
        });

        /**
         * Cursor hover effect for magnetic elements
         * Enlarges cursor and changes blend mode on hover
         */
        const magnets = document.querySelectorAll('[data-magnet]');
        magnets.forEach((magnet) => {
            // Enlarge cursor on hover
            magnet.addEventListener('mouseenter', () => {
                gsap.to(cursor, {
                    scale: 3,
                    backgroundColor: '#e1e1e1',
                    mixBlendMode: 'difference',
                    duration: 0.3
                });
                cursor.classList.add('hovered');
            });

            // Reset cursor size on leave
            magnet.addEventListener('mouseleave', () => {
                gsap.to(cursor, {
                    scale: 1,
                    backgroundColor: '#e1e1e1',
                    mixBlendMode: 'difference',
                    duration: 0.3
                });
                cursor.classList.remove('hovered');
            });
        });

        /**
         * Cursor hover effect for project cards
         * Shows "View" text and applies blur effect
         */
        const projectCards = document.querySelectorAll('[data-magnet-card]');
        projectCards.forEach((card) => {
            // Enlarge cursor and show "View" text on hover
            card.addEventListener('mouseenter', () => {
                gsap.to(cursor, {
                    scale: 3,
                    mixBlendMode: 'normal',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    backdropFilter: 'blur(5px)',
                    duration: 0.3
                });
                cursor.classList.add('hovered');
                cursorText.textContent = "View";
                cursorText.style.color = "#ffffff";
            });

            // Reset cursor and hide text on leave
            card.addEventListener('mouseleave', () => {
                gsap.to(cursor, {
                    scale: 1,
                    mixBlendMode: 'difference',
                    backgroundColor: '#e1e1e1',
                    backdropFilter: 'blur(0px)',
                    duration: 0.3
                });
                cursor.classList.remove('hovered');
                cursorText.textContent = "";
                cursorText.style.color = "";
            });
        });
    }

    /* SCROLL-BASED ANIMATIONS */

    /**
     * Hero parallax effect
     * Fades out and moves hero title as user scrolls down
     */
    gsap.to(".hero-title", {
        yPercent: 30,  // Move down 30% of element height
        opacity: 0,    // Fade out completely
        ease: "none",  // Linear animation for parallax effect
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",      // Start when hero reaches top of viewport
            end: "bottom top",     // End when hero bottom reaches viewport top
            scrub: true            // Tie animation directly to scroll position
        }
    });

    /**
     * Animate project cards on scroll
     * Each card fades in and slides up when entering viewport
     */
    const projects = document.querySelectorAll('.project-card');
    projects.forEach((project, i) => {
        gsap.from(project, {
            y: 100,        // Start 100px below final position
            opacity: 0,    // Start invisible
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: project,
                start: "top 85%",  // Trigger when element is 85% down the viewport
            }
        });
    });

    /**
     * Animate about section on scroll
     * Fades in and slides up when entering viewport
     */
    gsap.from(".about-content", {
        y: 50,         // Start 50px below final position
        opacity: 0,    // Start invisible
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".about-me",
            start: "top 75%",  // Trigger when section is 75% down the viewport
        }
    });

    /**
     * Animate education items on scroll
     * Each item fades in and slides up individually
     */
    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach((item, i) => {
        gsap.from(item, {
            y: 50,         // Start 50px below final position
            opacity: 0,    // Start invisible
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: item,
                start: "top 90%",  // Trigger when item is 90% down the viewport
            }
        });
    });

    /* LIVE CLOCK DISPLAY */

    /**
     * Updates the time display in footer every second
     * Shows current time in 12-hour format (HH:MM)
     */
    const timeEl = document.getElementById('time');
    setInterval(() => {
        const now = new Date();
        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }, 1000);

    /* BACK TO TOP BUTTON */

    if (backToTopBtn) {
        /**
         * Toggles visibility of back-to-top button based on scroll position
         * Hides when bottom sheet is active or user is near top of page
         */
        const toggleBackToTop = () => {
            // Hide button when bottom sheet is active to avoid overlap
            if (isBottomSheetActive) {
                backToTopBtn.classList.remove('visible');
                return;
            }

            // Show button after scrolling past hero section
            const triggerHeight = heroSection ? heroSection.offsetHeight : 500;
            if (window.scrollY > triggerHeight) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        };

        // Listen for scroll events to show/hide button
        window.addEventListener('scroll', toggleBackToTop);

        // Check initial position after brief delay
        setTimeout(toggleBackToTop, 100);

        /**
         * Scrolls page to top when back-to-top button is clicked
         * Uses Lenis smooth scroll if available, falls back to native scroll
         */
        backToTopBtn.addEventListener('click', () => {
            if (typeof lenis !== 'undefined') {
                // Use Lenis smooth scroll
                lenis.scrollTo(0);
            } else {
                // Fallback to native smooth scroll
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
}