// Wait for DOM to be fully loaded before initializing
document.addEventListener("DOMContentLoaded", () => {
    // Check if required libraries are loaded, retry if not
    function checkLibraries() {
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && typeof Lenis !== 'undefined') {
            initializeApp();
        } else {
            setTimeout(checkLibraries, 50);
        }
    }
    checkLibraries();
});

function initializeApp() {
    // Exit early if core libraries aren't available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        document.querySelector('.preloader').style.display = 'none';
        return;
    }
    
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Initialize Lenis smooth scroll if available
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        // Connect Lenis to requestAnimationFrame loop
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        
        // Enable smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                lenis.scrollTo(this.getAttribute('href'));
            });
        });
    }
    
    // Preloader animation with counter
    const counterElement = document.querySelector(".counter");
    const loadProgress = {
        val: 0
    };
    const tlLoader = gsap.timeline();
    
    // Animate counter from 0 to 100%
    tlLoader.to(loadProgress, {
        val: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
            if (counterElement) {
                counterElement.textContent = Math.floor(loadProgress.val) + "%";
            }
        }
    })
    // Slide preloader up and out of view
    .to(".preloader", {
        yPercent: -100,
        duration: 1,
        ease: "power4.inOut",
        delay: 0.2
    });
    
    // Get DOM elements for interactive features
    const cursor = document.querySelector('.cursor');
    const cursorText = document.querySelector('.cursor-text');
    const items = document.querySelectorAll('.capability-item');
    const bottomSheet = document.querySelector('.bottom-sheet');
    const overlay = document.querySelector('.bottom-sheet-overlay');
    const closeBtn = document.querySelector('.bottom-sheet-close');
    const bsNum = document.querySelector('.bs-num');
    const bsTitle = document.querySelector('.bs-title');
    const bsDesc = document.querySelector('.bs-desc');
    const backToTopBtn = document.querySelector('.back-to-top');
    const heroSection = document.querySelector('.hero');
    let isBottomSheetActive = false;

    // Open bottom sheet with capability details (mobile only)
    function openBottomSheet(item) {
        if (window.innerWidth > 1024) return;
        
        // Extract data from clicked item
        const num = item.querySelector('.capability-num').textContent;
        const name = item.querySelector('.capability-name').textContent;
        const desc = item.querySelector('.capability-desc').innerHTML;
        
        // Populate bottom sheet content
        bsNum.textContent = num;
        bsTitle.textContent = name;
        bsDesc.innerHTML = desc;
        
        // Show bottom sheet and overlay
        bottomSheet.classList.add('active');
        overlay.classList.add('active');
        isBottomSheetActive = true;
        
        // Hide back-to-top button when sheet is open
        if (backToTopBtn) backToTopBtn.classList.remove('visible');
    }

    // Close bottom sheet and restore back-to-top button
    function closeBottomSheet() {
        bottomSheet.classList.remove('active');
        overlay.classList.remove('active');
        isBottomSheetActive = false;
        
        // Restore back-to-top button if scrolled past hero
        if (backToTopBtn) {
            const triggerHeight = heroSection ? heroSection.offsetHeight : 500;
            if (window.scrollY > triggerHeight) {
                backToTopBtn.classList.add('visible');
            }
        }
    }
    
    // Attach event listeners for bottom sheet
    items.forEach(item => {
        item.addEventListener('click', () => openBottomSheet(item));
    });
    if (overlay) overlay.addEventListener('click', closeBottomSheet);
    if (closeBtn) closeBtn.addEventListener('click', closeBottomSheet);
    
    // Custom cursor interactions
    if (cursor) {
        // Make cursor follow mouse position
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out"
            });
        });
        
        // Cursor hover effect for magnetic elements
        const magnets = document.querySelectorAll('[data-magnet]');
        magnets.forEach((magnet) => {
            magnet.addEventListener('mouseenter', () => {
                gsap.to(cursor, {
                    scale: 3,
                    backgroundColor: '#e1e1e1',
                    mixBlendMode: 'difference',
                    duration: 0.3
                });
                cursor.classList.add('hovered');
            });
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
        
        // Cursor hover effect for project cards with "View" text
        const projectCards = document.querySelectorAll('[data-magnet-card]');
        projectCards.forEach((card) => {
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
    
    // Parallax effect: fade out hero title on scroll
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
    
    // Animate project cards on scroll into view
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
            }
        });
    });
    
    // Animate about section on scroll into view
    gsap.from(".about-content", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: ".about-me",
            start: "top 75%",
        }
    });
    
    // Animate education items on scroll into view
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
            }
        });
    });
    
    // Update time display every second
    const timeEl = document.getElementById('time');
    setInterval(() => {
        const now = new Date();
        if (timeEl) timeEl.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }, 1000);
    
    // Back to top button functionality
    if (backToTopBtn) {
        // Show/hide button based on scroll position
        const toggleBackToTop = () => {
            // Hide when bottom sheet is active
            if (isBottomSheetActive) {
                backToTopBtn.classList.remove('visible');
                return;
            }
            
            // Show after scrolling past hero section
            const triggerHeight = heroSection ? heroSection.offsetHeight : 500;
            if (window.scrollY > triggerHeight) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        };
        
        window.addEventListener('scroll', toggleBackToTop);
        setTimeout(toggleBackToTop, 100);
        
        // Scroll to top when button is clicked
        backToTopBtn.addEventListener('click', () => {
            if (typeof lenis !== 'undefined') {
                lenis.scrollTo(0);
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
}