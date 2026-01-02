/* ============================================
ALEXANDER BLAIR PORTFOLIO
JavaScript - GSAP Animations & Interactions
============================================ */

// Create visible debug log on mobile
const createDebugPanel = () => {
    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.style.cssText = 'position:fixed;top:0;left:0;right:0;background:rgba(0,0,0,0.5);color:#0f0;padding:10px;font-size:10px;z-index:10000;max-height:150px;overflow-y:auto;font-family:monospace;pointer-events:none;';
    document.body.appendChild(panel);
    return panel;
};

const debugLog = (msg) => {
    console.log(msg);
    const panel = document.getElementById('debug-panel');
    if (panel) {
        panel.innerHTML += msg + '<br>';
        panel.scrollTop = panel.scrollHeight;
    }
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const debugPanel = createDebugPanel();
    debugLog('DOM loaded, initializing portfolio...');

    // Set initial body class for intro
    document.body.classList.add('intro-active');

    // Check if GSAP is loaded
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded! Animations will not work.');
        debugLog('ERROR: GSAP not loaded!');
        alert('Error: Animation library failed to load. Please refresh the page.');
        return;
    }

    debugLog('GSAP loaded successfully (v' + gsap.version + ')');

    // Initialize all modules
    try {
        IntroSequence.init();
        ParallaxEffect.init();
        DeskInteractions.init();
        DayNightToggle.init();
        Navigation.init();
        RainEffect.init();
        debugLog('All modules initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        debugLog('ERROR: ' + error.message);
        alert('Error initializing portfolio: ' + error.message);
    }
});

/* ============================================
INTRO SEQUENCE
Door drawing + text fade-ins
============================================ */

const IntroSequence = {
init() {
    debugLog('Initializing IntroSequence...');
    this.introScreen = document.getElementById('intro-screen');
    this.introTitleContainer = document.getElementById('intro-title-container');
    this.portfolioTitle = document.getElementById('portfolio-title');
    this.portfolioTitleSmall = document.getElementById('portfolio-title-small');
    this.titleWords = document.querySelectorAll('.title-word');
    this.introContent = document.getElementById('intro-content');
    this.introLines = document.querySelectorAll('.intro-line');
    this.doorPaths = document.querySelectorAll('.door-path');
    this.doorHandle = document.querySelector('.door-handle');
    this.doorPrompt = document.getElementById('door-prompt');
    this.doorSvg = document.getElementById('door-svg');
    this.doorContainer = document.getElementById('door-container');
    this.introText = document.getElementById('intro-text');
    this.deskScene = document.getElementById('desk-scene');
    this.mainNav = document.getElementById('main-nav');
    this.hasTransitioned = false;

    debugLog('Elements: title=' + !!this.portfolioTitle + ' words=' + this.titleWords.length + ' paths=' + this.doorPaths.length);

    this.playTitleIntro();
    this.setupTitleHover();
    this.setupTitleClick();
    this.setupIntroParallax();
},

playTitleIntro() {
    debugLog('Starting impressive title intro...');
    const tl = gsap.timeline({
        onStart: () => debugLog('Title animation started'),
        onComplete: () => debugLog('Title animation completed')
    });

    // Animate each word with impressive effects
    this.titleWords.forEach((word, index) => {
        // Fade in, scale, and rotate with elastic bounce
        tl.to(word, {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 1.2,
            ease: 'elastic.out(1, 0.6)',
            onStart: () => debugLog('Animating word ' + index)
        }, index * 0.3);

        // Add a subtle glow pulse
        tl.to(word, {
            textShadow: '0 0 30px rgba(244, 162, 97, 0.6), 0 0 60px rgba(244, 162, 97, 0.3)',
            duration: 0.8,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: 1
        }, index * 0.3 + 0.5);
    });

    // Add floating animation after intro
    tl.add(() => {
        gsap.to(this.titleWords, {
            y: '+=10',
            duration: 2,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
            stagger: 0.2
        });
    }, '+=0.5');
},

setupTitleHover() {
    debugLog('Setting up title hover effects...');

    this.portfolioTitle.addEventListener('mouseenter', () => {
        if (this.hasTransitioned) return;

        gsap.to(this.titleWords[0], {
            x: -10,
            rotationY: -5,
            duration: 0.6,
            ease: 'power2.out'
        });

        gsap.to(this.titleWords[1], {
            x: 10,
            rotationY: 5,
            scale: 1.05,
            duration: 0.6,
            ease: 'power2.out'
        });

        gsap.to(this.titleWords, {
            textShadow: '0 0 40px rgba(244, 162, 97, 0.8), 0 0 80px rgba(244, 162, 97, 0.4)',
            duration: 0.4,
            ease: 'power2.out'
        });
    });

    this.portfolioTitle.addEventListener('mouseleave', () => {
        if (this.hasTransitioned) return;

        gsap.to(this.titleWords, {
            x: 0,
            rotationY: 0,
            scale: 1,
            textShadow: '0 0 20px rgba(244, 162, 97, 0.3)',
            duration: 0.6,
            ease: 'power2.out'
        });
    });
},

setupTitleClick() {
    debugLog('Setting up title click handler...');

    const clickHandler = () => {
        if (this.hasTransitioned) return;
        this.hasTransitioned = true;
        this.transitionToTopLeft();
    };

    this.portfolioTitle.addEventListener('click', clickHandler);
    this.portfolioTitle.addEventListener('touchend', (e) => {
        e.preventDefault();
        clickHandler();
    });
},

transitionToTopLeft() {
    debugLog('Transitioning title to top-left...');
    this.introTitleContainer.classList.add('transitioning');

    const tl = gsap.timeline({
        onComplete: () => {
            debugLog('Transition complete, showing door...');
            this.showDoorAndContent();
        }
    });

    // Kill all ongoing animations
    gsap.killTweensOf(this.titleWords);

    // Explosive exit - words scatter then fade
    tl.to(this.titleWords[0], {
        x: -200,
        y: -100,
        rotation: -15,
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        ease: 'power2.in'
    }, 0);

    tl.to(this.titleWords[1], {
        x: 200,
        y: 100,
        rotation: 15,
        opacity: 0,
        scale: 0.5,
        duration: 0.8,
        ease: 'power2.in'
    }, 0);

    // Fade out container
    tl.to(this.introTitleContainer, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in'
    }, 0.3);
},

showDoorAndContent() {
    debugLog('Showing door and content...');
    const tl = gsap.timeline();

    // Show intro content container
    tl.to(this.introContent, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3
    }, 0);

    // Animate small title in from top-left
    tl.fromTo(this.portfolioTitleSmall,
        {
            opacity: 0,
            x: -50,
            y: -20
        },
        {
            opacity: 1,
            x: 0,
            y: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, 0.2);

    // Show door container
    tl.to(this.doorContainer, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.5
    }, 0.3);

    // Animate door drawing
    this.animateDoorDrawing(tl, 0.5);

    // Setup door click after animation
    tl.add(() => {
        this.setupDoorClick();
    }, '+=0.5');
},

animateDoorDrawing(timeline, startTime) {
    debugLog('Animating door drawing...');

    this.doorPaths.forEach((path, index) => {
        const length = path.getTotalLength ? path.getTotalLength() : 1000;
        debugLog('Path ' + index + ' length: ' + length);

        // Set initial state
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        });

        // Animate the drawing with extra flair
        timeline.to(path, {
            strokeDashoffset: 0,
            duration: 2.5,
            ease: 'power1.inOut',
            onStart: () => debugLog('Drawing path ' + index)
        }, startTime + (index * 0.15));
    });

    // Fade in door handle
    timeline.to(this.doorHandle, {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'back.out(2)'
    }, startTime + 2.5);

    // Fade in door prompt with bounce
    timeline.fromTo(this.doorPrompt,
        {
            opacity: 0,
            y: -10
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
        }, startTime + 3);

    // Add pulsing glow to door when ready
    timeline.to(this.doorSvg, {
        filter: 'drop-shadow(0 0 30px rgba(244, 162, 97, 0.5))',
        duration: 0.8,
        ease: 'power2.out'
    }, startTime + 3.2);

    // Continuous glow pulse
    timeline.add(() => {
        gsap.to(this.doorSvg, {
            filter: 'drop-shadow(0 0 40px rgba(244, 162, 97, 0.6))',
            duration: 1.5,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1
        });
    }, startTime + 3.5);
},

setupDoorClick() {
    debugLog('Setting up door click handler...');
    // Support both click and touch events
    const enterDeskHandler = () => {
        debugLog('Door clicked! Entering desk...');
        this.enterDesk();
    };

    debugLog('Setting up door click handlers...');

    this.doorSvg.addEventListener('click', () => {
        debugLog('Door SVG click detected');
        enterDeskHandler();
    });

    this.doorSvg.addEventListener('touchend', (e) => {
        debugLog('Door SVG touchend detected');
        e.preventDefault();
        enterDeskHandler();
    });

    this.doorPrompt.addEventListener('click', () => {
        debugLog('Door prompt click detected');
        enterDeskHandler();
    });

    this.doorPrompt.addEventListener('touchend', (e) => {
        debugLog('Door prompt touchend detected');
        e.preventDefault();
        enterDeskHandler();
    });

    debugLog('Door click handlers set up. doorSvg=' + !!this.doorSvg + ' doorPrompt=' + !!this.doorPrompt);
},

setupIntroParallax() {
    // Only enable parallax on mobile
    if (!isMobile()) return;

    debugLog('Setting up intro parallax...');

    // Request device orientation permission (required for iOS 13+)
    const requestOrientationPermission = async () => {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            debugLog('Requesting device orientation permission...');
            try {
                const permission = await DeviceOrientationEvent.requestPermission();
                debugLog('Permission result: ' + permission);
                if (permission === 'granted') {
                    this.enableDeviceOrientation();
                } else {
                    debugLog('Permission denied, using touch fallback');
                }
            } catch (error) {
                debugLog('Permission error: ' + error.message);
            }
        } else if (window.DeviceOrientationEvent) {
            debugLog('Device orientation available without permission');
            this.enableDeviceOrientation();
        } else {
            debugLog('Device orientation not supported');
        }
    };

    // Request permission on first touch (iOS requirement)
    let permissionRequested = false;
    this.introScreen.addEventListener('touchstart', () => {
        if (!permissionRequested) {
            permissionRequested = true;
            requestOrientationPermission();
        }
    }, { once: true });

    // Also support touch/mouse movement as fallback
    const handleMove = (x, y) => {
        if (!this.introScreen || this.introScreen.style.display === 'none') return;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // Normalize to -1 to 1 range
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        this.applyIntroParallax(deltaX, deltaY);
    };

    this.introScreen.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        handleMove(touch.clientX, touch.clientY);
    });

    this.introScreen.addEventListener('mousemove', (e) => {
        handleMove(e.clientX, e.clientY);
    });
},

enableDeviceOrientation() {
    debugLog('Enabling device orientation listener');
    window.addEventListener('deviceorientation', (e) => {
        if (!this.introScreen || this.introScreen.style.display === 'none') return;

        // Get tilt angles (beta: front-to-back, gamma: left-to-right)
        const beta = e.beta || 0;   // Range: -180 to 180
        const gamma = e.gamma || 0;  // Range: -90 to 90

        // Normalize values to -1 to 1 range
        const tiltX = Math.max(-1, Math.min(1, gamma / 30));
        const tiltY = Math.max(-1, Math.min(1, (beta - 45) / 30)); // Offset by 45 for natural holding

        this.applyIntroParallax(tiltX, tiltY);
    });
},

applyIntroParallax(deltaX, deltaY) {
    // Text moves more (appears closer) - depth factor 1.5
    const textMoveX = deltaX * 20;
    const textMoveY = deltaY * 20;

    // Door moves less (appears further back) - depth factor 0.3
    const doorMoveX = deltaX * 6;
    const doorMoveY = deltaY * 6;

    gsap.to(this.introText, {
        x: textMoveX,
        y: textMoveY,
        duration: 0.5,
        ease: 'power2.out'
    });

    gsap.to([this.doorContainer, this.portfolioTitle], {
        x: doorMoveX,
        y: doorMoveY,
        duration: 0.5,
        ease: 'power2.out'
    });
},

enterDesk() {
    debugLog('enterDesk() called - starting transition...');

    // Kill all door animations
    gsap.killTweensOf(this.doorSvg);

    const tl = gsap.timeline({
        onStart: () => debugLog('Desk transition timeline started'),
        onComplete: () => debugLog('Desk transition timeline completed')
    });

    // Door opening animation - more dramatic
    tl.to(this.doorSvg, {
        scale: 3.5,
        rotation: 5,
        opacity: 0,
        filter: 'drop-shadow(0 0 60px rgba(244, 162, 97, 0.8))',
        duration: 1,
        ease: 'power2.in',
        onStart: () => debugLog('Animating door opening')
    });

    // Fade out intro content
    tl.to([this.portfolioTitleSmall, this.introLines, this.doorPrompt], {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onStart: () => debugLog('Fading out intro content')
    }, 0);

    // Fade out intro screen with flash effect
    tl.to(this.introScreen, {
        backgroundColor: '#f4a261',
        duration: 0.2,
        ease: 'power2.in'
    }, 0.6);

    tl.to(this.introScreen, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onStart: () => debugLog('Fading out intro screen'),
        onComplete: () => {
            debugLog('Intro screen hidden, switching to desk-active');
            this.introScreen.style.display = 'none';
            // Switch body classes to enable scrolling
            document.body.classList.remove('intro-active');
            document.body.classList.add('desk-active');
        }
    }, 0.8);

    // Reveal desk scene
    tl.add(() => {
        this.deskScene.classList.add('visible');
    }, 0.9);

    tl.fromTo(this.deskScene,
        { opacity: 0 },
        {
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out'
        }, 0.9
    );

    // Animate desk objects appearing and set up scroll
    tl.add(() => {
        DeskInteractions.revealObjects();
        // Scroll to top to ensure first section is active
        window.scrollTo(0, 0);
    }, 1.4);

    // Show navigation
    tl.add(() => {
        this.mainNav.classList.add('visible');
    }, 1.8);

    tl.fromTo(this.mainNav,
        { opacity: 0, y: -20 },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'back.out(1.7)'
        }, 1.8
    );
}

};

/* ============================================
PARALLAX EFFECT
Mouse movement creates depth
============================================ */

const ParallaxEffect = {
init() {
this.layers = document.querySelectorAll('.parallax-layer');
this.deskScene = document.getElementById('desk-scene');
this.centerX = window.innerWidth / 2;
this.centerY = window.innerHeight / 2;
this.isEnabled = false; // Disabled for scroll-linked navigation
this.scrollOffset = 0;
    // Parallax disabled for new scroll-linked design
    // this.setupListeners();
},

setupListeners() {
    // Disabled for scroll-linked navigation
},

handleScroll() {
    // Disabled for scroll-linked navigation
},

handleMove(x, y) {
    // Disabled for scroll-linked navigation
},

disable() {
    this.isEnabled = false;
},

enable() {
    this.isEnabled = true;
}

};

/* ============================================
DESK INTERACTIONS
Object hovers, clicks, and section navigation
============================================ */

const DeskInteractions = {
init() {
this.objects = document.querySelectorAll('.desk-object');
this.overlay = document.getElementById('section-overlay');
this.sectionContent = document.getElementById('section-content');
this.backButton = document.getElementById('back-to-desk');
this.deskScene = document.getElementById('desk-scene');
this.mainNav = document.getElementById('main-nav');
this.contentSections = document.querySelectorAll('.content-section');
this.isScrolling = false;

    this.setupScrollTracking();
    this.setupObjectClicks();
    this.setupBackButton();
    this.setupNavLinks();
    this.setupDogInteraction();
},

setupScrollTracking() {
    // Track scroll and update active symbol
    window.addEventListener('scroll', () => {
        if (!this.deskScene.classList.contains('visible')) return;

        this.updateActiveSymbol();
    });

    // Initial check
    setTimeout(() => this.updateActiveSymbol(), 100);
},

updateActiveSymbol() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const viewportCenter = scrollY + (window.innerHeight / 3); // Check upper third of viewport

    let activeSection = null;
    let minDistance = Infinity;

    // Find which section is closest to the top of viewport
    this.contentSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const sectionTop = scrollY + rect.top;
        const sectionBottom = sectionTop + rect.height;
        const sectionCenter = sectionTop + (rect.height / 2);

        // Calculate distance from viewport center to section center
        const distance = Math.abs(viewportCenter - sectionCenter);

        // Check if section is in viewport and closer than previous
        if (distance < minDistance && rect.top < window.innerHeight && rect.bottom > 0) {
            minDistance = distance;
            activeSection = section;
        }
    });

    // Update active class on symbols
    if (activeSection) {
        const sectionName = activeSection.dataset.section;

        this.objects.forEach(obj => {
            if (obj.dataset.section === sectionName) {
                obj.classList.add('active');
            } else {
                obj.classList.remove('active');
            }
        });
    }
},

revealObjects() {
    // Stagger animation for desk objects appearing
    gsap.fromTo(this.objects,
        { 
            opacity: 0, 
            y: 30,
            scale: 0.8
        },
        { 
            opacity: 1, 
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        }
    );

    // Animate ambient objects
    const ambientObjects = document.querySelectorAll('.ambient-object:not(#obj-dog)');
    gsap.fromTo(ambientObjects,
        { opacity: 0, y: 20 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 0.5, 
            stagger: 0.15,
            ease: 'power2.out',
            delay: 0.3
        }
    );
},

setupObjectClicks() {
    this.objects.forEach(obj => {
        const clickHandler = () => {
            const sectionName = obj.dataset.section;
            this.scrollToSection(sectionName);
        };

        obj.addEventListener('click', clickHandler);
        obj.addEventListener('touchend', (e) => {
            e.preventDefault();
            clickHandler();
        });
    });
},

scrollToSection(sectionName) {
    const targetSection = document.querySelector(`.content-section[data-section="${sectionName}"]`);
    if (!targetSection) return;

    // Smooth scroll to section
    this.isScrolling = true;

    const targetY = targetSection.offsetTop;

    window.scrollTo({
        top: targetY,
        behavior: 'smooth'
    });

    // Reset scrolling flag after animation
    setTimeout(() => {
        this.isScrolling = false;
    }, 1000);
},

setupNavLinks() {
    const navLinks = document.querySelectorAll('#main-nav a');
    navLinks.forEach(link => {
        const linkHandler = (e) => {
            e.preventDefault();
            const sectionName = link.getAttribute('href').replace('#', '');
            this.scrollToSection(sectionName);
        };

        link.addEventListener('click', linkHandler);
        link.addEventListener('touchend', linkHandler);
    });
},

openSection(sectionName, fromObject) {
    const tl = gsap.timeline();

    // Get section content
    const content = this.getSectionContent(sectionName);
    this.sectionContent.innerHTML = content;

    // Zoom into object effect
    if (fromObject) {
        const rect = fromObject.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        gsap.set(this.overlay, {
            transformOrigin: `${centerX}px ${centerY}px`
        });
    }

    // Show overlay
    this.overlay.classList.remove('hidden');
    
    tl.fromTo(this.overlay,
        { opacity: 0, scale: 0.8 },
        { 
            opacity: 1, 
            scale: 1,
            duration: 0.5, 
            ease: 'power2.out',
            onStart: () => {
                this.overlay.classList.add('visible');
            }
        }
    );

    // Fade out desk
    tl.to(this.deskScene, {
        opacity: 0.3,
        scale: 0.95,
        duration: 0.5,
        ease: 'power2.out'
    }, 0);

    // Disable parallax while in section
    ParallaxEffect.disable();
},

setupBackButton() {
    const backHandler = () => this.closeSection();

    this.backButton.addEventListener('click', backHandler);
    this.backButton.addEventListener('touchend', (e) => {
        e.preventDefault();
        backHandler();
    });
},

closeSection() {
    const tl = gsap.timeline();

    tl.to(this.overlay, {
        opacity: 0,
        scale: 0.9,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
            this.overlay.classList.remove('visible');
            this.overlay.classList.add('hidden');
        }
    });

    tl.to(this.deskScene, {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'power2.out'
    }, 0.2);

    // Re-enable parallax
    ParallaxEffect.enable();
},

getSectionContent(section) {
    const sections = {
        'marketing': `
            <h2>Marketing</h2>
            <p>SEO campaigns, YouTube growth strategies, LinkedIn organic impression work, and digital marketing expertise through Alenzie Solutions.</p>
            <p>This section will showcase your marketing case studies, analytics results, and strategic work.</p>
            <div class="placeholder-grid">
                <div class="placeholder-item">Case Study 1</div>
                <div class="placeholder-item">Case Study 2</div>
                <div class="placeholder-item">Case Study 3</div>
            </div>
        `,
        'brand-design': `
            <h2>Brand Design</h2>
            <p>Identity systems, logo design, visual strategy, and comprehensive brand development.</p>
            <p>This section will display your brand work, style guides, and identity projects.</p>
            <div class="placeholder-grid">
                <div class="placeholder-item">Brand Project 1</div>
                <div class="placeholder-item">Brand Project 2</div>
                <div class="placeholder-item">Brand Project 3</div>
            </div>
        `,
        'music': `
            <h2>Music Production</h2>
            <p>80+ tracks produced, with 20 market-ready pieces spanning multiple genres and styles.</p>
            <p>This section will feature your music portfolio, embedded players, and production highlights.</p>
            <div class="placeholder-grid">
                <div class="placeholder-item">Track 1</div>
                <div class="placeholder-item">Track 2</div>
                <div class="placeholder-item">Track 3</div>
            </div>
        `,
        'coding': `
            <h2>Code & Development</h2>
            <p>Sterling_bot: A comprehensive Discord bot with economy systems, games, and community features. 200+ commits on GitHub.</p>
            <p>Flowmaster: Background time tracker for OBS recordings with keystroke-responsive timestamps.</p>
            <div class="placeholder-grid">
                <div class="placeholder-item">Sterling_bot</div>
                <div class="placeholder-item">Flowmaster</div>
                <div class="placeholder-item">This Portfolio</div>
            </div>
        `,
        'drawing': `
            <h2>Raw Drawing</h2>
            <p>Traditional artwork, sketches, and hand-drawn illustrations spanning years of practice.</p>
            <p>This section will showcase your traditional art portfolio.</p>
            <div class="placeholder-grid">
                <div class="placeholder-item">Drawing 1</div>
                <div class="placeholder-item">Drawing 2</div>
                <div class="placeholder-item">Drawing 3</div>
            </div>
        `,
        'digital-art': `
            <h2>Digital Graphic Art</h2>
            <p>Digital illustrations, graphic design pieces, and digitally produced artwork.</p>
            <p>This section will display your digital art portfolio.</p>
            <div class="placeholder-grid">
                <div class="placeholder-item">Digital Art 1</div>
                <div class="placeholder-item">Digital Art 2</div>
                <div class="placeholder-item">Digital Art 3</div>
            </div>
        `,
        'video': `
            <h2>Video Production</h2>
            <p>5 long-form videos (16:9) and 25 short-form pieces (9:16). Proficient in Premiere Pro, learning After Effects.</p>
            <p>This section will feature your video work with embedded players.</p>
            <div class="placeholder-grid">
                <div class="placeholder-item">Long-form 1</div>
                <div class="placeholder-item">Long-form 2</div>
                <div class="placeholder-item">Shorts Reel</div>
            </div>
        `
    };

    return sections[section] || '<h2>Section</h2><p>Content coming soon.</p>';
},

setupDogInteraction() {
    const dog = document.getElementById('obj-dog');
    const tail = dog.querySelector('.dog-tail');

    const speedUpTail = () => {
        // Speed up tail wagging
        gsap.to(tail, {
            animationDuration: '0.2s',
            overwrite: true
        });
    };

    const normalTail = () => {
        gsap.to(tail, {
            animationDuration: '0.5s',
            overwrite: true
        });
    };

    dog.addEventListener('mouseenter', speedUpTail);
    dog.addEventListener('mouseleave', normalTail);

    // Touch support for mobile
    dog.addEventListener('touchstart', speedUpTail);
    dog.addEventListener('touchend', normalTail);
}

};

/* ============================================
DAY/NIGHT TOGGLE
Theme switching with transitions
============================================ */

const DayNightToggle = {
init() {
this.toggle = document.getElementById('day-night-toggle');
this.isNight = false;

    this.setupToggle();
},

setupToggle() {
    const toggleHandler = () => {
        this.isNight = !this.isNight;
        this.switchTheme();
    };

    this.toggle.addEventListener('click', toggleHandler);
    this.toggle.addEventListener('touchend', (e) => {
        e.preventDefault();
        toggleHandler();
    });
},

switchTheme() {
    const tl = gsap.timeline();

    if (this.isNight) {
        // Transition to night
        document.body.classList.add('night-mode');
        
        // Fade in rain
        tl.to('#rain-container', {
            opacity: 1,
            duration: 1,
            ease: 'power2.inOut'
        }, 0);

        // Generate rain if not already
        RainEffect.start();

        // Dog appears
        tl.to('#obj-dog', {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power2.out'
        }, 0.5);

    } else {
        // Transition to day
        document.body.classList.remove('night-mode');
        
        // Fade out rain
        tl.to('#rain-container', {
            opacity: 0,
            duration: 1,
            ease: 'power2.inOut'
        }, 0);

        RainEffect.stop();

        // Dog disappears
        tl.to('#obj-dog', {
            opacity: 0,
            x: -30,
            duration: 0.5,
            ease: 'power2.in'
        }, 0);
    }
}

};

/* ============================================
RAIN EFFECT
Animated raindrops for night mode
============================================ */

const RainEffect = {
init() {
this.container = document.getElementById('rain-container');
this.isRaining = false;
this.raindrops = [];
},

start() {
    if (this.isRaining) return;
    this.isRaining = true;

    // Create raindrops
    for (let i = 0; i < 50; i++) {
        this.createRaindrop();
    }
},

createRaindrop() {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    drop.style.left = Math.random() * 100 + '%';
    drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + 's';
    drop.style.animationDelay = Math.random() * 2 + 's';
    drop.style.opacity = Math.random() * 0.5 + 0.3;
    
    this.container.appendChild(drop);
    this.raindrops.push(drop);
},

stop() {
    this.isRaining = false;
    
    // Remove raindrops with fade
    this.raindrops.forEach(drop => {
        gsap.to(drop, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => drop.remove()
        });
    });
    
    this.raindrops = [];
}


};

/* ============================================
NAVIGATION
Smooth scroll and active states
============================================ */

const Navigation = {
init() {
this.nav = document.getElementById('main-nav');
// Additional nav functionality can be added here
}
};

/* ============================================
UTILITY FUNCTIONS
============================================ */

// Detect if device is mobile
function isMobile() {
return window.innerWidth <= 1024;
}

// Debounce function for performance
function debounce(func, wait) {
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