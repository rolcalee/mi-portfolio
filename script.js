(function() {
    "use strict";
    
    /* ============================================
       1. DEFINE ALL FUNCTIONS FIRST
       ============================================ */
    
    // Scroll reveal function
    function triggerReveal() {
        const revealEls = document.querySelectorAll('.reveal');
        revealEls.forEach(function(el) {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const isVisible = rect.top < windowHeight - 80 && rect.bottom > 80;
            if (isVisible) {
                el.classList.add('visible');
            }
        });
    }
    
    // Progress bar update function
    function updateProgress() {
        const progressBar = document.getElementById('progressBar');
        if (!progressBar) return;
        
        const snapContainer = document.getElementById('snapContainer');
        let scrollTop, scrollHeight, clientHeight, pct = 0;
        
        // Check if we're on desktop with snapContainer scrolling
        if (snapContainer && window.innerWidth > 768) {
            // DESKTOP: snapContainer handles scrolling
            scrollTop = snapContainer.scrollTop;
            scrollHeight = snapContainer.scrollHeight;
            clientHeight = snapContainer.clientHeight;
        } else {
            // MOBILE: window handles scrolling
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            scrollHeight = document.documentElement.scrollHeight;
            clientHeight = window.innerHeight;
        }
        
        const docHeight = scrollHeight - clientHeight;
        if (docHeight > 0) {
            pct = (scrollTop / docHeight) * 100;
        }
        
        // Clamp between 0 and 100
        pct = Math.min(100, Math.max(0, pct));
        
        // Force 100% at bottom for mobile
        if (window.innerWidth <= 768) {
            const isAtBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 2;
            if (isAtBottom) pct = 100;
        }
        
        progressBar.style.width = pct + '%';
    }
    
    /* ============================================
       2. LOADING SCREEN
       ============================================ */
    const loadingScreen = document.getElementById('loadingScreen');
    let hideExecuted = false;
    
    // Prevent scrolling while loading screen is visible
    if (loadingScreen) {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
    }
    
    function forceHideLoading() {
        if (hideExecuted) return;
        hideExecuted = true;
        if (!loadingScreen) return;
        if (loadingScreen.classList.contains('hide')) return;
        
        loadingScreen.classList.add('hide');
        setTimeout(function() {
            if (loadingScreen) loadingScreen.classList.add('gone');
            // Restore scrolling after loading screen is gone
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }, 700);
        
        setTimeout(triggerReveal, 150);
    }
    
    const startTime = Date.now();
    const minimumDelay = 3000; // Changed to 3 seconds for better UX
    
    function hideAfterMinimum() {
        const elapsed = Date.now() - startTime;
        const remaining = minimumDelay - elapsed;
        if (remaining > 0) {
            setTimeout(forceHideLoading, remaining);
        } else {
            forceHideLoading();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideAfterMinimum);
    } else {
        hideAfterMinimum();
    }
    
    window.addEventListener('load', hideAfterMinimum);
    window.addEventListener('pageshow', hideAfterMinimum);
    
    setTimeout(function() {
        if (loadingScreen && !loadingScreen.classList.contains('gone')) {
            forceHideLoading();
        }
    }, 7000);
    
    /* ============================================
       3. SCROLL REVEAL EVENT LISTENERS
       ============================================ */
    const snapContainer = document.getElementById('snapContainer');
    
    setTimeout(triggerReveal, 600);
    
    if (snapContainer) {
        snapContainer.addEventListener('scroll', triggerReveal, { passive: true });
    }
    window.addEventListener('scroll', triggerReveal, { passive: true });
    window.addEventListener('resize', triggerReveal);
    
    /* ============================================
       4. PROGRESS BAR EVENT LISTENERS
       ============================================ */
    // Listen to appropriate scroll events
    if (snapContainer) {
        snapContainer.addEventListener('scroll', updateProgress, { passive: true });
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    window.addEventListener('touchend', updateProgress);
    window.addEventListener('load', updateProgress);
    
    // Initial update
    updateProgress();
    
    /* ============================================
       5. NAVIGATION BUTTONS
       ============================================ */
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const id = btn.getAttribute('data-section');
            const target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    
    const navContainer = document.getElementById('navButtons');
    if (navContainer && window.innerWidth > 768) {
        navContainer.classList.add('hide-nav');
        document.addEventListener('mousemove', function(e) {
            if (e.clientX >= window.innerWidth - 130) {
                navContainer.classList.remove('hide-nav');
            } else {
                navContainer.classList.add('hide-nav');
            }
        });
    } else if (navContainer && window.innerWidth <= 768) {
        navContainer.style.display = 'none';
    }
    
    /* ============================================
       6. CV DOWNLOAD FUNCTIONALITY
       ============================================ */
    function downloadCV() {
        const link = document.createElement('a');
        link.href = 'RESUME.pdf';
        link.download = 'RESUME.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        const fb = document.getElementById('formFeedback');
        if (fb) {
            fb.innerText = '📄 Attempting to download CV. If not found, please add "RESUME.pdf".';
            fb.style.color = '#f39c12';
            setTimeout(function() { 
                if (fb) fb.innerText = ''; 
            }, 4000);
        }
    }
    
    const dlBtn = document.getElementById('downloadCVBtn');
    const dlBtn2 = document.getElementById('downloadCVBtn2');
    
    if (dlBtn) dlBtn.addEventListener('click', downloadCV);
    if (dlBtn2) dlBtn2.addEventListener('click', downloadCV);
    
    /* ============================================
       7. CONTACT FORM HANDLER
       ============================================ */
    const sendBtn = document.getElementById('sendMsgBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const msgInput = document.getElementById('contactMsg');
            const fb = document.getElementById('formFeedback');
            
            const name = nameInput ? nameInput.value : '';
            const email = emailInput ? emailInput.value : '';
            const msg = msgInput ? msgInput.value : '';
            
            if (!name.trim() || !email.trim() || !msg.trim()) {
                if (fb) { 
                    fb.innerText = '❌ Please fill all fields.'; 
                    fb.style.color = '#c0392b'; 
                }
            } else {
                if (fb) { 
                    fb.innerText = '✅ Message sent! (demo mode)'; 
                    fb.style.color = '#2ecc71'; 
                }
                if (nameInput) nameInput.value = '';
                if (emailInput) emailInput.value = '';
                if (msgInput) msgInput.value = '';
            }
            
            setTimeout(function() { 
                if (fb) fb.innerText = ''; 
            }, 3000);
        });
    }
})();

/* ============================================
   8. HERO SECTION ANIMATIONS
   ============================================ */
(function() {
    "use strict";
    
    const section = document.getElementById('heroSection');
    if (!section) return;
    
    const mouseGlow = document.getElementById('mouseGlow');
    const mouseGlowSecondary = document.getElementById('mouseGlowSecondary');
    const particleField = document.getElementById('particleField');
    const pulseOverlay = document.getElementById('pulseOverlay');
    
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let targetGlowX = mouseX;
    let targetGlowY = mouseY;
    let targetGlowSecX = mouseX;
    let targetGlowSecY = mouseY;
    let currentGlowX = mouseX;
    let currentGlowY = mouseY;
    let currentGlowSecX = mouseX;
    let currentGlowSecY = mouseY;
    let animationId = null;
    
    function handleMouseMove(e) {
        const rect = section.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        
        if (pulseOverlay) {
            pulseOverlay.style.setProperty('--pulse-x', (mouseX / rect.width) * 100 + '%');
            pulseOverlay.style.setProperty('--pulse-y', (mouseY / rect.height) * 100 + '%');
        }
        
        targetGlowX = mouseX;
        targetGlowY = mouseY;
        targetGlowSecX = mouseX + 30;
        targetGlowSecY = mouseY - 20;
    }
    
    function smoothFollow() {
        currentGlowX += (targetGlowX - currentGlowX) * 0.15;
        currentGlowY += (targetGlowY - currentGlowY) * 0.15;
        currentGlowSecX += (targetGlowSecX - currentGlowSecX) * 0.08;
        currentGlowSecY += (targetGlowSecY - currentGlowSecY) * 0.08;
        
        if (mouseGlow) {
            mouseGlow.style.transform = `translate(${currentGlowX - 400}px, ${currentGlowY - 400}px)`;
        }
        if (mouseGlowSecondary) {
            mouseGlowSecondary.style.transform = `translate(${currentGlowSecX - 200}px, ${currentGlowSecY - 200}px)`;
        }
        
        animationId = requestAnimationFrame(smoothFollow);
    }
    
    function createParticles() {
        if (!particleField) return;
        const particleCount = 40;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 6 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            const duration = 6 + Math.random() * 6;
            const delay = Math.random() * 5;
            particle.style.animation = `floatParticle ${duration}s ease-in-out infinite`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.opacity = 0.1 + Math.random() * 0.2;
            particleField.appendChild(particle);
        }
    }
    
    function handleMouseLeave() {
        const rect = section.getBoundingClientRect();
        targetGlowX = rect.width / 2;
        targetGlowY = rect.height / 2;
        targetGlowSecX = rect.width / 2 + 30;
        targetGlowSecY = rect.height / 2 - 20;
        if (pulseOverlay) {
            pulseOverlay.style.setProperty('--pulse-x', '50%');
            pulseOverlay.style.setProperty('--pulse-y', '50%');
        }
    }
    
    function addRingSubtleMovement() {
        const rings = document.querySelectorAll('.ring');
        rings.forEach((ring, index) => {
            const speed = 0.002 + index * 0.0005;
            let angle = 0;
            const radius = 3;
            
            function animateRing() {
                angle += speed;
                const x = Math.sin(angle) * radius;
                const y = Math.cos(angle * 0.7) * radius;
                ring.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${angle * 30}deg)`;
                requestAnimationFrame(animateRing);
            }
            animateRing();
        });
    }
    
    function handleResize() {
        const rect = section.getBoundingClientRect();
        if (mouseX > rect.width) mouseX = rect.width / 2;
        if (mouseY > rect.height) mouseY = rect.height / 2;
        targetGlowX = mouseX;
        targetGlowY = mouseY;
    }
    
    function createFloatingOrbs() {
        const orbColors = ['rgba(59, 110, 255, 0.06)', 'rgba(100, 150, 255, 0.05)', 'rgba(161, 196, 253, 0.04)'];
        for (let i = 0; i < 8; i++) {
            const orb = document.createElement('div');
            orb.style.position = 'absolute';
            orb.style.width = Math.random() * 200 + 100 + 'px';
            orb.style.height = orb.style.width;
            orb.style.borderRadius = '50%';
            orb.style.background = `radial-gradient(circle, ${orbColors[i % orbColors.length]}, transparent)`;
            orb.style.filter = 'blur(30px)';
            orb.style.pointerEvents = 'none';
            orb.style.zIndex = '0';
            orb.style.left = Math.random() * 100 + '%';
            orb.style.top = Math.random() * 100 + '%';
            orb.style.animation = `floatOrb ${15 + Math.random() * 10}s ease-in-out infinite`;
            section.appendChild(orb);
        }
    }
    
    if (!document.querySelector('#heroAnimationStyles')) {
        const styleSheet = document.createElement("style");
        styleSheet.id = 'heroAnimationStyles';
        styleSheet.textContent = `
            @keyframes floatOrb {
                0%, 100% { transform: translate(0%, 0%) scale(1); }
                25% { transform: translate(3%, -4%) scale(1.05); }
                50% { transform: translate(-2%, 5%) scale(0.98); }
                75% { transform: translate(4%, 2%) scale(1.02); }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    function init() {
        createParticles();
        createFloatingOrbs();
        addRingSubtleMovement();
        
        const rect = section.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        currentGlowX = centerX;
        currentGlowY = centerY;
        currentGlowSecX = centerX + 30;
        currentGlowSecY = centerY - 20;
        targetGlowX = centerX;
        targetGlowY = centerY;
        targetGlowSecX = centerX + 30;
        targetGlowSecY = centerY - 20;
        
        if (mouseGlow) {
            mouseGlow.style.transform = `translate(${centerX - 400}px, ${centerY - 400}px)`;
        }
        if (mouseGlowSecondary) {
            mouseGlowSecondary.style.transform = `translate(${centerX + 30 - 200}px, ${centerY - 20 - 200}px)`;
        }
        
        smoothFollow();
    }
    
    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);
    
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function(e) {
            e.stopPropagation();
            window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        });
    }
    
    init();
    
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
})();

/* ============================================
   9. CERTIFICATE MODAL FUNCTIONALITY
   ============================================ */
(function() {
    "use strict";
    
    const certificateRegistry = {
        "How To Grow and Level-Up Your Career with I.T. Certifications": {
            title: "Certificate - How To Grow and Level-Up Your Career with I.T Certifications",
            imagePath: "imgs/cert-2026-howtogrow.jpg",
            issuer: "Tech Academy",
            date: "April 24, 2026"
        },
        "Elevating Wireframing Development": {
            title: "Certificate - Elevating Wireframing Development",
            imagePath: "imgs/cert-2024-elevate.jpg",
            issuer: "University of Rizal System",
            date: "September 27, 2024"
        },
        "Introduction to PHP": {
            title: "Certificate - Introduction to PHP",
            imagePath: "imgs/tba.png",
            issuer: "BCC",
            date: "November 25, 2022"
        },
        "Sublime Text: MiniHTML Reference": {
            title: "Certificate - Sublime Text",
            imagePath: "imgs/tba.png",
            issuer: "BCC",
            date: "November 11, 2022"
        },
        "Data Visualization Fundamentals": {
            title: "Certificate - Data Visualization",
            imagePath: "imgs/tba.png",
            issuer: "BCC",
            date: "November 11, 2022"
        },
        "Introduction to UX/UI using Adobe XD": {
            title: "Certificate - UX/UI Design",
            imagePath: "imgs/tba.png",
            issuer: "BCC",
            date: "November 11, 2022"
        },
        "Introduction to Android Studio": {
            title: "Certificate - Android Studio",
            imagePath: "imgs/tba.png",
            issuer: "BCC",
            date: "November 25, 2022"
        }
    };
    
    let isAnimating = false;
    let currentScrollY = 0;
    
    function createModal() {
        if (document.getElementById('certificateModal')) return;
        
        const modalHTML = `
            <div id="certificateModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="modalCertTitle">Certificate</h3>
                        <button class="close-modal" id="closeModalBtn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div id="certificateLoading" class="certificate-loading">
                            <div class="loading-spinner"></div>
                            <div class="loading-text">Loading certificate...</div>
                        </div>
                        <img id="certificateImage" class="certificate-img" src="" alt="Certificate">
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    function getTrainingName(badgeElement) {
        const clone = badgeElement.cloneNode(true);
        const smallTags = clone.querySelectorAll('small');
        smallTags.forEach(tag => tag.remove());
        return clone.textContent.trim();
    }
    
    function showLoading() {
        const loadingEl = document.getElementById('certificateLoading');
        const certImage = document.getElementById('certificateImage');
        if (loadingEl) loadingEl.style.display = 'flex';
        if (certImage) {
            certImage.classList.remove('loaded');
            certImage.style.opacity = '0';
        }
    }
    
    function hideLoading() {
        const loadingEl = document.getElementById('certificateLoading');
        const certImage = document.getElementById('certificateImage');
        if (loadingEl) loadingEl.style.display = 'none';
        if (certImage) {
            setTimeout(() => {
                certImage.style.opacity = '1';
                certImage.classList.add('loaded');
            }, 50);
        }
    }
    
    function preventBodyScroll() {
        currentScrollY = window.scrollY;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${currentScrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
    }
    
    function allowBodyScroll() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, currentScrollY);
    }
    
    function openCertificate(certData, trainingName) {
        if (isAnimating) return;
        
        const modal = document.getElementById('certificateModal');
        const certImage = document.getElementById('certificateImage');
        const modalTitle = document.getElementById('modalCertTitle');
        
        if (!modal || !certImage) return;
        
        certImage.classList.remove('loaded', 'placeholder-img');
        certImage.style.opacity = '0';
        modalTitle.textContent = certData.title || trainingName;
        
        showLoading();
        
        preventBodyScroll();
        
        modal.style.display = 'flex';
        modal.offsetHeight;
        modal.classList.add('animate-in', 'active');
        
        const img = new Image();
        
        img.onload = () => {
            certImage.src = certData.imagePath;
            certImage.classList.remove('placeholder-img');
            hideLoading();
        };
        
        img.onerror = () => {
            certImage.src = certData.imagePath;
            certImage.classList.add('placeholder-img');
            hideLoading();
        };
        
        img.src = certData.imagePath;
    }
    
    function closeModal() {
        if (isAnimating) return;
        
        const modal = document.getElementById('certificateModal');
        if (!modal || !modal.classList.contains('active')) return;
        
        isAnimating = true;
        
        modal.classList.remove('animate-in');
        modal.classList.add('animate-out');
        
        setTimeout(() => {
            modal.classList.remove('active', 'animate-out');
            modal.style.display = 'none';
            
            allowBodyScroll();
            
            const certImage = document.getElementById('certificateImage');
            if (certImage) {
                certImage.src = '';
                certImage.classList.remove('loaded', 'placeholder-img');
            }
            
            isAnimating = false;
        }, 350);
    }
    
    function setupTrainingCertificateHandlers() {
        const trainingBadges = document.querySelectorAll('.training-badge');
        
        trainingBadges.forEach(badge => {
            const trainingName = getTrainingName(badge);
            const certInfo = certificateRegistry[trainingName];
            
            if (certInfo) {
                badge.classList.add('has-certificate');
                
                const handleClick = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    openCertificate(certInfo, trainingName);
                };
                
                badge.addEventListener('click', handleClick);
                badge.addEventListener('touchstart', handleClick, { passive: false });
            }
        });
    }
    
    function init() {
        createModal();
        setupTrainingCertificateHandlers();
        
        const modal = document.getElementById('certificateModal');
        const closeBtn = document.getElementById('closeModalBtn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
            closeBtn.addEventListener('touchstart', closeModal);
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal && !isAnimating) {
                    closeModal();
                }
            });
        }
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
