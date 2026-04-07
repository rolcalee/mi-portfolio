(function() {
    var loadingScreen = document.getElementById('loadingScreen');

    // === 5 SECOND LOADING SCREEN ===
    // Minimum display time set to 5000ms (5 seconds) before hiding.
        
    let hideExecuted = false;
    
    function forceHideLoading() {
        if (hideExecuted) return;
        hideExecuted = true;
        if (!loadingScreen) return;
        if (loadingScreen.classList.contains('hide')) return;
        loadingScreen.classList.add('hide');
        setTimeout(function() {
            if (loadingScreen) loadingScreen.classList.add('gone');
        }, 700);
        // trigger reveal animations after loading disappears
        setTimeout(triggerReveal, 150);
    }

    let startTime = Date.now();
    let minimumDelay = 5000; // 5 seconds requirement
    
    function hideAfterMinimum() {
        let elapsed = Date.now() - startTime;
        let remaining = minimumDelay - elapsed;
        if (remaining > 0) {
            setTimeout(forceHideLoading, remaining);
        } else {
            forceHideLoading();
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            hideAfterMinimum();
        });
    } else {
        hideAfterMinimum();
    }
    
    window.addEventListener('load', function() {
        hideAfterMinimum();
    });
    
    window.addEventListener('pageshow', function() {
        hideAfterMinimum();
    });
    
    setTimeout(function() {
        if (loadingScreen && !loadingScreen.classList.contains('gone')) {
            forceHideLoading();
        }
    }, 7000);
    
    // ========== Reveal logic ==========
    var snapContainer = document.getElementById('snapContainer');
    var revealEls = document.querySelectorAll('.reveal');
    
    function isVisible(el) {
        var rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight - 80 && rect.bottom > 80;
    }
    
    function triggerReveal() {
        revealEls.forEach(function(el) {
            if (isVisible(el)) el.classList.add('visible');
        });
    }
    
    if (snapContainer) {
        snapContainer.addEventListener('scroll', triggerReveal, { passive: true });
    }
    window.addEventListener('scroll', triggerReveal, { passive: true });
    window.addEventListener('resize', triggerReveal);
    
    setTimeout(function() {
        var hello = document.getElementById('helloTrigger');
        if (hello) hello.classList.add('visible');
        triggerReveal();
    }, 600);
    
    // progress bar
    var progressBar = document.getElementById('progressBar');
    function updateProgress() {
        var el = snapContainer || document.documentElement;
        var scrollTop = el.scrollTop || window.scrollY;
        var docHeight = (el.scrollHeight || document.body.scrollHeight) - (el.clientHeight || window.innerHeight);
        var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progressBar) progressBar.style.width = Math.min(pct, 100) + '%';
    }
    if (snapContainer) snapContainer.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    
    // nav buttons
    document.querySelectorAll('.nav-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var id = btn.getAttribute('data-section');
            var target = document.getElementById(id);
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    
    var navContainer = document.getElementById('navButtons');
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
    
    function downloadCV() {
        var link = document.createElement('a');
        link.href = 'RESUME.pdf';
        link.download = 'RESUME.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        var fb = document.getElementById('formFeedback');
        if (fb) {
            fb.innerText = '📄 Attempting to download CV. If not found, please add "RESUME.pdf".';
            fb.style.color = '#f39c12';
            setTimeout(function() { if (fb) fb.innerText = ''; }, 4000);
        }
    }
    var dlBtn = document.getElementById('downloadCVBtn');
    var dlBtn2 = document.getElementById('downloadCVBtn2');
    var dlFooter = document.getElementById('footerDownloadCV');
    if (dlBtn) dlBtn.addEventListener('click', downloadCV);
    if (dlBtn2) dlBtn2.addEventListener('click', downloadCV);
    if (dlFooter) dlFooter.addEventListener('click', downloadCV);
    
    var sendBtn = document.getElementById('sendMsgBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var name = (document.getElementById('contactName') || {}).value || '';
            var email = (document.getElementById('contactEmail') || {}).value || '';
            var msg = (document.getElementById('contactMsg') || {}).value || '';
            var fb = document.getElementById('formFeedback');
            if (!name.trim() || !email.trim() || !msg.trim()) {
                if (fb) { fb.innerText = '❌ Please fill all fields.'; fb.style.color = '#c0392b'; }
            } else {
                if (fb) { fb.innerText = '✅ Message sent! (demo mode)'; fb.style.color = '#2ecc71'; }
                document.getElementById('contactName').value = '';
                document.getElementById('contactEmail').value = '';
                document.getElementById('contactMsg').value = '';
            }
            setTimeout(function() { if (fb) fb.innerText = ''; }, 3000);
        });
    }
})();