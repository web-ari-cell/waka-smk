document.addEventListener("DOMContentLoaded", function () {
    
    // 1. LOADING SCREEN REMOVER
    const loader = document.getElementById('loading-screen');
    if(loader) {
        window.addEventListener('load', () => {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        });
    }

    // 2. LAZY LOADING IMAGES
    const lazyImages = document.querySelectorAll('img.lazy');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const image = entry.target;
                image.src = image.dataset.src;
                image.classList.remove('lazy');
                observer.unobserve(image);
            }
        });
    });
    lazyImages.forEach(image => imageObserver.observe(image));

    // 3. INITIALIZE AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // 4. SWIPER SLIDERS
    new Swiper('.hero-swiper', {
        autoplay: { delay: 4000, disableOnInteraction: false },
        effect: 'fade',
        fadeEffect: { crossFade: true },
        loop: true,
        speed: 1000
    });

    new Swiper('.news-swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: { el: '.swiper-pagination', clickable: true },
        breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
    });

    new Swiper('.testimonial-swiper', {
        autoplay: { delay: 5000 },
        loop: true
    });

    // 5. ANIMATED COUNTER
    const counters = document.querySelectorAll('.counter');
    const speed = 150;
    const triggerCounter = (counter) => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = Math.ceil(target / speed);
            if (count < target) {
                counter.innerText = count + inc;
                setTimeout(updateCount, 15);
            } else {
                counter.innerText = target + (target === 250 ? '+' : '');
            }
        };
        updateCount();
    };

    const counterSection = document.querySelector('.bg-gradient');
    const counterObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
            counters.forEach(counter => triggerCounter(counter));
            counterObserver.unobserve(counterSection);
        }
    }, { threshold: 0.5 });
    if(counterSection) counterObserver.observe(counterSection);

    // 6. LIGHTBOX
    GLightbox({ selector: '.glightbox' });

    // 7. BACK TO TOP BUTTON
    const bttButton = document.getElementById("backToTop");
    window.onscroll = function() {
        if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
            bttButton.style.display = "block";
        } else {
            bttButton.style.display = "none";
        }
    };
    bttButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 8. DARK MODE CONTROLLER
    const toggleBtn = document.getElementById('dark-mode-toggle');
    toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', targetTheme);
        toggleBtn.innerHTML = targetTheme === 'dark' ? '<i class="fas fa-sun text-warning"></i>' : '<i class="fas fa-moon"></i>';
    });

    // 9. PARTICLES ENGINE
    if(document.getElementById('particles-js')) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 40, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.2, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#ffffff", "opacity": 0.1, "width": 1 },
                "move": { "enable": true, "speed": 1.5, "direction": "none", "random": true }
            },
            "retina_detect": true
        });
    }

    // --- 10. AUTHENTICATION SYSTEM FOR DASHBOARD ---
    const SIMULATED_USERS = [
        { username: "admin", password: "password123", role: "Waka Kurikulum", redirect: "dashboard-waka.html" },
        { username: "guru123", password: "guru123", role: "Guru Pengajar", redirect: "dashboard-guru.html" }
    ];

    const btnDashboard = document.getElementById('btn-dashboard');
    const authLoginForm = document.getElementById('authLoginForm');
    const loginAlert = document.getElementById('loginAlert');
    const loginModalEl = document.getElementById('loginModal');
    const loginModal = new bootstrap.Modal(loginModalEl);

    btnDashboard.addEventListener('click', function() {
        const currentSession = sessionStorage.getItem('userSession');
        if (currentSession) {
            const user = JSON.parse(currentSession);
            alert(`Selamat datang kembali, ${user.role}! Mengalihkan...`);
            window.location.href = user.redirect;
        } else {
            loginModal.show();
        }
    });

    if (authLoginForm) {
        authLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userInput = document.getElementById('loginUser').value;
            const passInput = document.getElementById('loginPass').value;
            const matchedUser = SIMULATED_USERS.find(u => u.username === userInput && u.password === passInput);
            
            if (matchedUser) {
                loginAlert.classList.add('d-none');
                sessionStorage.setItem('userSession', JSON.stringify({
                    username: matchedUser.username,
                    role: matchedUser.role,
                    redirect: matchedUser.redirect
                }));
                btnDashboard.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                loginModal.hide();
                setTimeout(() => { window.location.href = matchedUser.redirect; }, 800);
            } else {
                loginAlert.innerText = "Username atau Password salah!";
                loginAlert.classList.remove('d-none');
                loginAlert.style.animation = "none";
                setTimeout(() => { loginAlert.style.animation = "shake 0.3s ease-in-out"; }, 10);
            }
        });
    }

    // Dynamic Shake Keyframe Animation Injector
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            75% { transform: translateX(6px); }
        }
    `, styleSheet.cssRules.length);
});