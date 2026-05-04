/* ============================================
   COMPLETE FIXED JAVASCRIPT
   ============================================ */

/* ============================================
   TABLE OF CONTENTS
   ============================================
   1. DEFINE ALL FUNCTIONS
      - Scroll reveal function
      - Progress bar update function
   2. LOADING SCREEN
   3. SCROLL REVEAL EVENT LISTENERS
   4. PROGRESS BAR EVENT LISTENERS
   5. NAVIGATION BUTTONS
   6. CV DOWNLOAD FUNCTIONALITY
   7. CONTACT FORM HANDLER
      - EmailJS Integration
      - Animations & Loading States
      - Character Counter (400 char limit)
      - Philippine Time Zone
      - Form Validation
   8. HERO SECTION ANIMATIONS
      - Mouse glow effects
      - Particle field
      - Floating orbs
      - Ring animations
   9. CERTIFICATE MODAL FUNCTIONALITY
      - Modal creation
      - Image loading
      - Body scroll lock
   ============================================ */

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
        
        // DESKTOP: use snapContainer (only on screens > 1280px)
        if (snapContainer && window.innerWidth > 1280) {
            scrollTop = snapContainer.scrollTop;
            scrollHeight = snapContainer.scrollHeight;
            clientHeight = snapContainer.clientHeight;
        } else {
            // TABLET & MOBILE: use window scroll
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            scrollHeight = document.documentElement.scrollHeight;
            clientHeight = window.innerHeight;
        }
        
        const docHeight = scrollHeight - clientHeight;
        if (docHeight > 0) {
            pct = (scrollTop / docHeight) * 100;
        }
        
        pct = Math.min(100, Math.max(0, pct));
        
        // Force 100% at bottom for tablet/mobile
        if (window.innerWidth <= 1280) {
            const isAtBottom = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 5;
            if (isAtBottom) pct = 100;
        }
        
        progressBar.style.width = pct + '%';
    }
    
    /* ============================================
       2. LOADING SCREEN
       ============================================ */
    const loadingScreen = document.getElementById('loadingScreen');
    let hideExecuted = false;
    const startTime = Date.now();
    
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
    
    const minimumDelay = 3000;
    
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
    if (snapContainer) {
        snapContainer.addEventListener('scroll', updateProgress, { passive: true });
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    window.addEventListener('touchend', updateProgress);
    window.addEventListener('load', updateProgress);
    
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
    if (navContainer && window.innerWidth > 1280) {
        navContainer.classList.add('hide-nav');
        document.addEventListener('mousemove', function(e) {
            if (e.clientX >= window.innerWidth - 130) {
                navContainer.classList.remove('hide-nav');
            } else {
                navContainer.classList.add('hide-nav');
            }
        });
    } else if (navContainer && window.innerWidth <= 1280) {
        navContainer.style.display = 'none';
    }
    
    window.addEventListener('resize', function() {
        const navContainer = document.getElementById('navButtons');
        if (!navContainer) return;
        
        if (window.innerWidth <= 1280) {
            navContainer.style.display = 'none';
        } else {
            navContainer.style.display = 'flex';
            navContainer.classList.add('hide-nav');
            
            document.addEventListener('mousemove', function(e) {
                if (e.clientX >= window.innerWidth - 130) {
                    navContainer.classList.remove('hide-nav');
                } else {
                    navContainer.classList.add('hide-nav');
                }
            });
        }
    });
    
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


//     /* ============================================
//        7. CONTACT FORM HANDLER ---- DEMO ONLY
//        ============================================ */
//     const sendBtn = document.getElementById('sendMsgBtn');
//     if (sendBtn) {
//         sendBtn.addEventListener('click', function(e) {
//             e.preventDefault();
            
//             const nameInput = document.getElementById('contactName');
//             const emailInput = document.getElementById('contactEmail');
//             const msgInput = document.getElementById('contactMsg');
//             const fb = document.getElementById('formFeedback');
            
//             const name = nameInput ? nameInput.value : '';
//             const email = emailInput ? emailInput.value : '';
//             const msg = msgInput ? msgInput.value : '';
            
//             if (!name.trim() || !email.trim() || !msg.trim()) {
//                 if (fb) { 
//                     fb.innerText = ' Please fill all fields.'; 
//                     fb.style.color = '#c0392b'; 
//                 }
//             } else {
//                 if (fb) { 
//                     fb.innerText = ' Message sent! (demo mode)'; 
//                     fb.style.color = '#2ecc71'; 
//                 }
//                 if (nameInput) nameInput.value = '';
//                 if (emailInput) emailInput.value = '';
//                 if (msgInput) msgInput.value = '';
//             }
            
//             setTimeout(function() { 
//                 if (fb) fb.innerText = ''; 
//             }, 3000);
//         });
//     }
// })();


    /* ============================================
       7. CONTACT FORM HANDLER
          - EmailJS Integration
          - Animations & Loading States
          - Character Counter (400 char limit)
          - Philippine Time Zone
          - Form Validation
          - Message disappears after 5 seconds
          - Fixed input boxes (no scaling)
       ============================================ */
    
    emailjs.init("jvfCnNTrV1u4Nsu3X");
    
    const sendBtn = document.getElementById('sendMsgBtn');
    
    if (sendBtn) {
        // Add all animation styles
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes fadeOutDown {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(10px);
                }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @keyframes successPop {
                0% { transform: scale(0); opacity: 0; }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); opacity: 1; }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .btn-loading {
                position: relative;
                pointer-events: none;
                opacity: 0.7;
            }
            
            .btn-loading::after {
                content: '';
                position: absolute;
                width: 18px;
                height: 18px;
                top: 50%;
                left: 50%;
                margin-left: -9px;
                margin-top: -9px;
                border: 2px solid rgba(255,255,255,0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: spin 0.8s linear infinite;
            }
            
            .btn-loading i {
                opacity: 0;
            }
            
            .btn-success {
                background: linear-gradient(135deg, #00b894, #00cec9) !important;
                animation: pulse 0.3s ease;
            }
            
            .feedback-message {
                animation: fadeInUp 0.3s ease;
                padding: 10px 15px;
                border-radius: 8px;
                margin-top: 10px;
                font-weight: 500;
            }
            
            .feedback-success {
                background: rgba(0, 184, 148, 0.1);
                border-left: 3px solid #00b894;
                color: #00b894;
            }
            
            .feedback-error {
                background: rgba(214, 48, 49, 0.1);
                border-left: 3px solid #d63031;
                color: #d63031;
            }
            
            .feedback-sending {
                background: rgba(253, 203, 110, 0.1);
                border-left: 3px solid #fdce6e;
                color: #fdce6e;
            }
            
            .checkmark-animation {
                display: inline-block;
                animation: successPop 0.4s ease;
            }
            
            .char-counter {
                text-align: right;
                font-size: 0.8rem;
                margin-top: -15px;
                transition: all 0.2s ease;
            }
            
            .char-counter.normal {
                color: #888;
            }
            
            .char-counter.warning {
                color: #fdce6e;
            }
            
            .char-counter.danger {
                color: #d63031;
            }
            
            .char-counter.limit-reached {
                color: #d63031;
                font-weight: bold;
            }
            
            /* FIXED INPUT BOXES - NO SCALING AT ALL */
            #contactMsg {
                resize: none !important;
                min-height: 150px;
                width: 100%;
                transition: all 0.2s ease;
            }
            
            /* Also fix all input fields to prevent any scaling */
            .contact-form input,
            .contact-form textarea {
                resize: none !important;
                box-sizing: border-box;
            }
            
            #contactMsg:focus {
                border-color: #3b6eff;
                outline: none;
            }
            
            #contactMsg.limit-warning {
                border-color: #fdce6e;
                background-color: rgba(253, 206, 110, 0.05);
            }
            
            #contactMsg.limit-exceeded {
                border-color: #d63031;
                background-color: rgba(214, 48, 49, 0.05);
            }
        `;
        document.head.appendChild(styleSheet);
        
        // Character limit functionality (400 characters)
        const msgInput = document.getElementById('contactMsg');
        const MAX_CHARS = 400;
        
        if (msgInput) {
            const counterDiv = document.createElement('div');
            counterDiv.className = 'char-counter normal';
            counterDiv.id = 'charCounter';
            msgInput.parentNode.insertBefore(counterDiv, msgInput.nextSibling);
            
            function updateCharCounter() {
                const currentLength = msgInput.value.length;
                const remaining = MAX_CHARS - currentLength;
                const counter = document.getElementById('charCounter');
                
                if (counter) {
                    counter.textContent = `${currentLength} / ${MAX_CHARS} characters`;
                    
                    if (remaining <= 0) {
                        counter.className = 'char-counter limit-reached';
                        counter.textContent = `Limit reached! ${MAX_CHARS}/${MAX_CHARS} characters`;
                    } else if (remaining <= 20) {
                        counter.className = 'char-counter danger';
                        counter.textContent = `${remaining} characters remaining`;
                    } else if (remaining <= 50) {
                        counter.className = 'char-counter warning';
                    } else {
                        counter.className = 'char-counter normal';
                    }
                }
                
                if (currentLength >= MAX_CHARS) {
                    msgInput.classList.add('limit-exceeded');
                    msgInput.classList.remove('limit-warning');
                } else if (currentLength >= MAX_CHARS - 50) {
                    msgInput.classList.add('limit-warning');
                    msgInput.classList.remove('limit-exceeded');
                } else {
                    msgInput.classList.remove('limit-warning', 'limit-exceeded');
                }
                
                if (currentLength > MAX_CHARS) {
                    msgInput.value = msgInput.value.substring(0, MAX_CHARS);
                    updateCharCounter();
                }
            }
            
            msgInput.addEventListener('input', updateCharCounter);
            msgInput.addEventListener('keyup', updateCharCounter);
            msgInput.addEventListener('paste', function() {
                setTimeout(updateCharCounter, 10);
            });
            
            updateCharCounter();
        }
        
        // Form submission handler
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();

            const nameInput = document.getElementById('contactName');
            const emailInput = document.getElementById('contactEmail');
            const msgInput = document.getElementById('contactMsg');
            const fb = document.getElementById('formFeedback');
            const btnIcon = sendBtn.querySelector('i');
            const msgLength = msgInput ? msgInput.value.length : 0;
            
            let name = nameInput ? nameInput.value : '';
            let email = emailInput ? emailInput.value : '';
            let msg = msgInput ? msgInput.value : '';

            // Function to scroll to form smoothly
            function scrollToForm() {
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }

            // Clear any existing timeout to prevent conflicts
            if (window.messageTimeout) {
                clearTimeout(window.messageTimeout);
            }

            // Helper function to show message with auto-remove
            function showMessageWithAutoRemove(type, message, duration = 5000) {
                if (fb) {
                    fb.className = `feedback-message feedback-${type}`;
                    fb.innerHTML = message;
                    fb.style.animation = 'fadeInUp 0.3s ease forwards';
                    
                    // Scroll to form when showing error messages
                    if (type === 'error') {
                        scrollToForm();
                    }
                    
                    // Clear any existing timeout
                    if (window.messageTimeout) {
                        clearTimeout(window.messageTimeout);
                    }
                    
                    // Set timeout to remove message after specified duration
                    window.messageTimeout = setTimeout(() => {
                        if (fb) {
                            fb.style.animation = 'fadeOutDown 0.3s ease forwards';
                            setTimeout(() => {
                                if (fb) {
                                    fb.innerHTML = '';
                                    fb.className = '';
                                    fb.style.animation = '';
                                }
                                window.messageTimeout = null;
                            }, 300);
                        }
                    }, duration);
                }
            }

            // VALIDATION - Check all fields
            if (!name.trim() || !email.trim() || !msg.trim()) {
                const emptyFields = [];
                if (!name.trim()) emptyFields.push(nameInput);
                if (!email.trim()) emptyFields.push(emailInput);
                if (!msg.trim()) emptyFields.push(msgInput);
                
                emptyFields.forEach(field => {
                    if (field) {
                        field.style.animation = 'shake 0.3s ease';
                        field.style.borderColor = '#d63031';
                        setTimeout(() => {
                            if (field) {
                                field.style.animation = '';
                                setTimeout(() => {
                                    if (field) field.style.borderColor = '';
                                }, 500);
                            }
                        }, 300);
                    }
                });
                
                showMessageWithAutoRemove('error', 'Please fill all fields. (Name, Email, and Message are required)', 5000);
                return;
            }
            
            // Email validation
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email.trim())) {
                if (emailInput) {
                    emailInput.style.animation = 'shake 0.3s ease';
                    emailInput.style.borderColor = '#d63031';
                    setTimeout(() => {
                        if (emailInput) {
                            emailInput.style.animation = '';
                            setTimeout(() => {
                                if (emailInput) emailInput.style.borderColor = '';
                            }, 500);
                        }
                    }, 300);
                }
                showMessageWithAutoRemove('error', 'Please enter a valid email address (e.g., name@example.com)', 5000);
                return;
            }
            
            // Character limit check
            if (msgLength > MAX_CHARS) {
                if (msgInput) {
                    msgInput.style.animation = 'shake 0.3s ease';
                    msgInput.style.borderColor = '#d63031';
                    setTimeout(() => {
                        if (msgInput) {
                            msgInput.style.animation = '';
                            setTimeout(() => {
                                if (msgInput) msgInput.style.borderColor = '';
                            }, 500);
                        }
                    }, 300);
                }
                showMessageWithAutoRemove('error', `Message exceeds ${MAX_CHARS} character limit. Current: ${msgLength}/${MAX_CHARS}`, 5000);
                return;
            }

            // Reset border colors on success
            if (nameInput) nameInput.style.borderColor = '';
            if (emailInput) emailInput.style.borderColor = '';
            if (msgInput) msgInput.style.borderColor = '';

            // Philippine Time Zone configuration
            const now = new Date();
            
            const phDate = now.toLocaleDateString('en-PH', { 
                timeZone: 'Asia/Manila',
                year: 'numeric',
                month: 'long', 
                day: 'numeric' 
            });
            
            const phTime = now.toLocaleTimeString('en-PH', { 
                timeZone: 'Asia/Manila',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true 
            });
            
            const phFullDateTime = now.toLocaleString('en-PH', { 
                timeZone: 'Asia/Manila',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });

            const params = {
                from_name: name,
                from_email: email,
                message: msg,
                send_date: phDate,
                send_time: phTime,
                send_datetime: phFullDateTime,
                timezone: 'Philippine Time (PHT - UTC+8)'
            };

            // Loading state
            sendBtn.classList.add('btn-loading');
            if (btnIcon) btnIcon.style.opacity = '0';
            
            showMessageWithAutoRemove('sending', '📧 Sending your message...', 5000);

            // Send email via EmailJS
            emailjs.send(
                "service_9047jru",
                "template_8n983j8",
                params
            )
            .then(function() {
                // Success state
                sendBtn.classList.remove('btn-loading');
                sendBtn.classList.add('btn-success');
                if (btnIcon) {
                    btnIcon.className = 'fas fa-check';
                    btnIcon.style.opacity = '1';
                }
                
                showMessageWithAutoRemove('success', '✓ Message sent successfully!', 5000);

                // Clear form fields
                if (nameInput) {
                    nameInput.style.transition = 'all 0.3s';
                    nameInput.style.opacity = '0';
                    setTimeout(() => {
                        nameInput.value = '';
                        nameInput.style.opacity = '1';
                    }, 200);
                }
                if (emailInput) {
                    emailInput.style.transition = 'all 0.3s';
                    emailInput.style.opacity = '0';
                    setTimeout(() => {
                        emailInput.value = '';
                        emailInput.style.opacity = '1';
                    }, 200);
                }
                if (msgInput) {
                    msgInput.style.transition = 'all 0.3s';
                    msgInput.style.opacity = '0';
                    setTimeout(() => {
                        msgInput.value = '';
                        msgInput.style.opacity = '1';
                        const counterEvent = new Event('input');
                        msgInput.dispatchEvent(counterEvent);
                    }, 200);
                }
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    sendBtn.classList.remove('btn-success');
                    if (btnIcon) {
                        btnIcon.className = 'fas fa-paper-plane';
                    }
                }, 2000);
            })
            .catch(function(error) {
                console.error('EmailJS Error:', error);
                
                // Error state
                sendBtn.classList.remove('btn-loading');
                if (btnIcon) btnIcon.style.opacity = '1';
                
                showMessageWithAutoRemove('error', 'Failed to send message. Please try again.', 5000);
                
                const form = document.querySelector('.contact-form');
                if (form) {
                    form.style.animation = 'shake 0.4s ease';
                    setTimeout(() => {
                        if (form) form.style.animation = '';
                    }, 400);
                }
            });
        });
    }
    
    /* ============================================
       8. HERO SECTION ANIMATIONS
          - Mouse glow effects
          - Particle field
          - Floating orbs
          - Ring animations
       ============================================ */
    (function() {
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
          - Modal creation
          - Image loading
          - Body scroll lock
       ============================================ */
    (function() {
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
    
})();
