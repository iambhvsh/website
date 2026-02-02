document.addEventListener("DOMContentLoaded", () => {

    /**
     * Initialize Animation Libraries
     * Sets up GSAP ScrollTrigger and Lenis smooth scrolling.
     */
    if (typeof gsap === 'undefined') {
        document.querySelector('.preloader').style.display = 'none';
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        /**
         * Request Animation Frame loop for Lenis
         * @param {number} time - Current time
         */
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                lenis.scrollTo(this.getAttribute('href'));
            });
        });
    }

    /**
     * Preloader Animation
     * Animates the loading counter and reveals the page content.
     * Uses a timeline to sequence the counter release and the curtain lift.
     */
    const counterElement = document.querySelector(".counter");
    const loadProgress = { val: 0 };

    const tlLoader = gsap.timeline();

    tlLoader.to(loadProgress, {
        val: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
            // Ensure integer value to avoid display glitches
            if (counterElement) {
                counterElement.textContent = Math.floor(loadProgress.val) + "%";
            }
        }
    })
    .to(".preloader", {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
        delay: 0.2,
        onComplete: () => {
            // Remove preloader from DOM after animation to improve performance
            const preloader = document.querySelector('.preloader');
            if (preloader) {
                preloader.style.display = 'none';
            }
        }
    });

    /**
     * Custom Cursor & Interaction Logic
     * Handles cursor movement, magnet effects, and bottom sheet interactions.
     * - .cursor: The main dot cursor
     * - data-magnet: Elements that attract the cursor
     * - data-magnet-card: Project cards with special hover state
     */
    const cursor = document.querySelector('.cursor');
    const cursorText = document.querySelector('.cursor-text');

    // Bottom Sheet Elements
    const items = document.querySelectorAll('.capability-item');
    const bottomSheet = document.querySelector('.bottom-sheet');
    const overlay = document.querySelector('.bottom-sheet-overlay');
    const closeBtn = document.querySelector('.bottom-sheet-close');
    const bsNum = document.querySelector('.bs-num');
    const bsTitle = document.querySelector('.bs-title');
    const bsDesc = document.querySelector('.bs-desc');

    // Back to Top Elements
    const backToTopBtn = document.querySelector('.back-to-top');
    const heroSection = document.querySelector('.hero');
    let isBottomSheetActive = false;

    /**
     * Opens the bottom sheet with details from the clicked item.
     * Only active on mobile/tablet devices (<= 1024px).
     * @param {HTMLElement} item - The clicked capability item
     */
    function openBottomSheet(item) {
        if (window.innerWidth > 1024) return;

        const num = item.querySelector('.capability-num').textContent;
        const name = item.querySelector('.capability-name').textContent;
        const desc = item.querySelector('.capability-desc').innerHTML;

        bsNum.textContent = num;
        bsTitle.textContent = name;
        bsDesc.innerHTML = desc;

        bottomSheet.classList.add('active');
        overlay.classList.add('active');

        isBottomSheetActive = true;
        if (backToTopBtn) backToTopBtn.classList.remove('visible');
    }

    /**
     * Closes the active bottom sheet.
     */
    function closeBottomSheet() {
        bottomSheet.classList.remove('active');
        overlay.classList.remove('active');

        isBottomSheetActive = false;
        // Check if back-to-top should be visible again
        if (backToTopBtn) {
            const triggerHeight = heroSection ? heroSection.offsetHeight : 500;
            if (window.scrollY > triggerHeight) {
                backToTopBtn.classList.add('visible');
            }
        }
    }

    // Event Listeners for Bottom Sheet
    items.forEach(item => {
        item.addEventListener('click', () => openBottomSheet(item));
    });

    if (overlay) overlay.addEventListener('click', closeBottomSheet);
    if (closeBtn) closeBtn.addEventListener('click', closeBottomSheet);

    // Desktop-only Cursor Effects
    if (cursor && window.innerWidth > 1024) {
        // Use requestAnimationFrame for smooth cursor movement
        let cursorX = 0;
        let cursorY = 0;
        let currentX = 0;
        let currentY = 0;

        window.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;
        });

        // Smooth cursor animation loop
        function animateCursor() {
            // Lerp for smooth following
            currentX += (cursorX - currentX) * 0.1;
            currentY += (cursorY - currentY) * 0.1;

            cursor.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Magnet effect for interactive elements
        const magnets = document.querySelectorAll('[data-magnet]');
        magnets.forEach((magnet) => {
            magnet.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 3, backgroundColor: '#e1e1e1', mixBlendMode: 'difference', duration: 0.3 });
                cursor.classList.add('hovered');
            });

            magnet.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, backgroundColor: '#e1e1e1', mixBlendMode: 'difference', duration: 0.3 });
                cursor.classList.remove('hovered');
            });
        });

        // Specialized cursor for Project Cards
        const projectCards = document.querySelectorAll('[data-magnet-card]');
        projectCards.forEach((card) => {
            card.addEventListener('mouseenter', () => {
                gsap.to(cursor, {
                    scale: 3,
                    mixBlendMode: 'normal',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(5px)',
                    duration: 0.3
                });
                cursor.classList.add('hovered');
                cursorText.textContent = "View";
                cursorText.style.color = "#ffffff";
            });

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

    // Scroll-Triggered Animations

    // Parallax effect for Hero Title
    gsap.to(".hero-title", {
        yPercent: 30,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Staggered reveal for Project Cards
    const projects = document.querySelectorAll('.project-card');
    projects.forEach((project, i) => {
        gsap.from(project, {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: project,
                start: "top 85%",
                once: true
            }
        });
    });

    // About Me Section
    gsap.from(".about-content", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".about-me",
            start: "top 75%",
            once: true
        }
    });

    // Education Section
    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach((item, i) => {
        gsap.from(item, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
                trigger: item,
                start: "top 90%",
                once: true
            }
        });
    });

    // Live Time Update
    const timeEl = document.getElementById('time');
    let lastTimeString = '';
    
    const updateTime = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        // Only update DOM if time has changed
        if (timeString !== lastTimeString && timeEl) {
            timeEl.textContent = timeString;
            lastTimeString = timeString;
        }
    };
    
    // Update immediately
    updateTime();
    // Then update every second
    setInterval(updateTime, 1000);

    // Back to Top Logic
    if (backToTopBtn) {
        let ticking = false;

        const toggleBackToTop = () => {
            // Hide button if bottom sheet is active
            if (isBottomSheetActive) {
                backToTopBtn.classList.remove('visible');
                return;
            }

            // Show button only when passed the hero section
            const triggerHeight = heroSection ? heroSection.offsetHeight : 500;
            if (window.scrollY > triggerHeight) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }

            ticking = false;
        };

        // Throttle scroll event with requestAnimationFrame
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(toggleBackToTop);
                ticking = true;
            }
        };

        // Use passive listener for better scroll performance
        window.addEventListener('scroll', onScroll, { passive: true });
        
        // Initial check (delay slightly to ensure layout)
        setTimeout(toggleBackToTop, 100);

        // Scroll to top on click
        backToTopBtn.addEventListener('click', () => {
            if (typeof lenis !== 'undefined') {
                lenis.scrollTo(0);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // Add 'loaded' class when images are fully loaded
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /// Remove GSAP animations on mobile to improve performance
    if (window.innerWidth <= 768) {
        // Disable ScrollTrigger on mobile
        ScrollTrigger.getAll().forEach(trigger => {
            trigger.kill();
        });
    }

    // Remove event listeners to prevent memory leaks
    window.addEventListener('beforeunload', () => {
        // Kill all GSAP animations
        gsap.killTweensOf('*');
        
        // Kill all ScrollTriggers
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        
        // Stop Lenis
        if (lenis) {
            lenis.destroy();
        }
    });
});
