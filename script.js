/* ============================================
ALEXANDER BLAIR PORTFOLIO
JavaScript - GSAP Animations & Interactions
============================================ */

// Create visible debug log on mobile
const createDebugPanel = () => {
    const panel = document.createElement('div');
    panel.id = 'debug-panel';
    panel.style.cssText = 'position:fixed;top:0;left:0;right:0;background:rgba(0,0,0,0.9);color:#0f0;padding:10px;font-size:10px;z-index:10000;max-height:150px;overflow-y:auto;font-family:monospace;';
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
    this.portfolioTitle = document.getElementById('portfolio-title');
    this.introLines = document.querySelectorAll('.intro-line');
    this.doorPaths = document.querySelectorAll('.door-path');
    this.doorHandle = document.querySelector('.door-handle');
    this.doorPrompt = document.getElementById('door-prompt');
    this.doorSvg = document.getElementById('door-svg');
    this.deskScene = document.getElementById('desk-scene');
    this.mainNav = document.getElementById('main-nav');

    debugLog('Elements: title=' + !!this.portfolioTitle + ' lines=' + this.introLines.length + ' paths=' + this.doorPaths.length);

    this.playIntro();
    this.setupDoorClick();
},

playIntro() {
    debugLog('Starting intro animation...');
    const tl = gsap.timeline({
        onStart: () => debugLog('Timeline started'),
        onComplete: () => debugLog('Timeline completed')
    });

    // Fade in portfolio title
    tl.to(this.portfolioTitle, {
        opacity: 1,
        duration: 0.4,
        ease: 'power2.out',
        onStart: () => debugLog('Animating title')
    }, 0.3);

    // Start drawing the door at the same time
    debugLog('Door paths found: ' + this.doorPaths.length);
    this.doorPaths.forEach((path, index) => {
        const length = path.getTotalLength ? path.getTotalLength() : 1000;
        debugLog('Path ' + index + ' length: ' + length);

        // Set initial state
        gsap.set(path, {
            strokeDasharray: length,
            strokeDashoffset: length
        });

        // Animate the drawing
        tl.to(path, {
            strokeDashoffset: 0,
            duration: 2.2,
            ease: 'power1.inOut',
            onStart: () => debugLog('Drawing path ' + index)
        }, 0.3 + (index * 0.1));
    });

    // Fade in intro text lines
    this.introLines.forEach((line) => {
        const delay = parseFloat(line.dataset.delay);
        tl.to(line, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
        }, delay);
    });

    // Fade in door handle
    tl.to(this.doorHandle, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
    }, 2.4);

    // Fade in door prompt
    tl.to(this.doorPrompt, {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
    }, 3);

    // Add glow to door when ready
    tl.to(this.doorSvg, {
        filter: 'drop-shadow(0 0 20px rgba(244, 162, 97, 0.3))',
        duration: 0.5,
        ease: 'power2.out'
    }, 3);
},

setupDoorClick() {
    // Support both click and touch events
    const enterDeskHandler = () => this.enterDesk();

    this.doorSvg.addEventListener('click', enterDeskHandler);
    this.doorSvg.addEventListener('touchend', (e) => {
        e.preventDefault();
        enterDeskHandler();
    });

    this.doorPrompt.addEventListener('click', enterDeskHandler);
    this.doorPrompt.addEventListener('touchend', (e) => {
        e.preventDefault();
        enterDeskHandler();
    });
},

enterDesk() {
    const tl = gsap.timeline();

    // Door opening animation
    tl.to(this.doorSvg, {
        scale: 3,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in'
    });

    // Fade out intro content
    tl.to([this.portfolioTitle, this.introLines, this.doorPrompt], {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
    }, 0);

    // Fade out intro screen
    tl.to(this.introScreen, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => {
            this.introScreen.style.display = 'none';
        }
    }, 0.5);

    // Reveal desk scene
    tl.add(() => {
        this.deskScene.classList.add('visible');
    }, 0.6);

    tl.fromTo(this.deskScene, 
        { opacity: 0 },
        { 
            opacity: 1, 
            duration: 0.8, 
            ease: 'power2.out' 
        }, 0.6
    );

    // Animate desk objects appearing
    tl.add(() => {
        DeskInteractions.revealObjects();
    }, 1);

    // Show navigation
    tl.add(() => {
        this.mainNav.classList.add('visible');
    }, 1.2);

    tl.fromTo(this.mainNav,
        { opacity: 0, y: -20 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 0.5, 
            ease: 'power2.out' 
        }, 1.2
    );
}

};

/* ============================================
PARALLAX EFFECT
Mouse movement creates depth
============================================ */

const ParallaxEffect = {
init() {
this.layers = document.querySelectorAll(’.parallax-layer’);
this.deskScene = document.getElementById(‘desk-scene’);
this.centerX = window.innerWidth / 2;
this.centerY = window.innerHeight / 2;
this.isEnabled = true;
    this.setupListeners();
},

setupListeners() {
    // Disable parallax on mobile for performance
    if (isMobile()) {
        this.isEnabled = false;
        return;
    }

    // Mouse move for parallax
    document.addEventListener('mousemove', (e) => {
        if (!this.isEnabled) return;
        if (!this.deskScene.classList.contains('visible')) return;

        this.handleMove(e.clientX, e.clientY);
    });

    // Touch move for mobile parallax
    document.addEventListener('touchmove', (e) => {
        if (!this.isEnabled) return;
        if (!this.deskScene.classList.contains('visible')) return;

        const touch = e.touches[0];
        this.handleMove(touch.clientX, touch.clientY);
    });

    // Recalculate center on resize
    window.addEventListener('resize', () => {
        this.centerX = window.innerWidth / 2;
        this.centerY = window.innerHeight / 2;
    });
},

handleMove(x, y) {
    const deltaX = (x - this.centerX) / this.centerX;
    const deltaY = (y - this.centerY) / this.centerY;

    this.layers.forEach(layer => {
        const depth = parseFloat(layer.dataset.depth);
        const moveX = deltaX * 30 * depth;
        const moveY = deltaY * 20 * depth;

        gsap.to(layer, {
            x: moveX,
            y: moveY,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
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
this.objects = document.querySelectorAll(’.desk-object’);
this.overlay = document.getElementById(‘section-overlay’);
this.sectionContent = document.getElementById(‘section-content’);
this.backButton = document.getElementById(‘back-to-desk’);
this.deskScene = document.getElementById(‘desk-scene’);
this.mainNav = document.getElementById(‘main-nav’);

    this.setupObjectClicks();
    this.setupBackButton();
    this.setupNavLinks();
    this.setupDogInteraction();
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
            const section = obj.dataset.section;
            this.openSection(section, obj);
        };

        obj.addEventListener('click', clickHandler);
        obj.addEventListener('touchend', (e) => {
            e.preventDefault();
            clickHandler();
        });
    });
},

setupNavLinks() {
    const navLinks = document.querySelectorAll('#main-nav a');
    navLinks.forEach(link => {
        const linkHandler = (e) => {
            e.preventDefault();
            const section = link.getAttribute('href').replace('#', '');
            const obj = document.querySelector(`[data-section="${section}"]`);
            this.openSection(section, obj);
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
this.toggle = document.getElementById(‘day-night-toggle’);
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
this.container = document.getElementById(‘rain-container’);
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
this.nav = document.getElementById(‘main-nav’);
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
return function executedFunction(…args) {
const later = () => {
clearTimeout(timeout);
func(…args);
};
clearTimeout(timeout);
timeout = setTimeout(later, wait);
};
}