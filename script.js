// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobMenu = document.getElementById('mob-menu');
if (hamburger && mobMenu) {
    hamburger.addEventListener('click', () => {
        mobMenu.classList.toggle('open');
    });
}

// ===== FADE / SLIDE / POP ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .fade-left, .fade-right, .pop-up').forEach(el => {
    observer.observe(el);
});

// ===== BAR CHART ANIMATE =====
const bars = document.querySelectorAll('.bc');
const barHeights = Array.from(bars).map(b => b.style.height);
bars.forEach(b => b.style.height = '0');
const barObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            bars.forEach((b, i) => {
                setTimeout(() => {
                    b.style.transition = 'height 0.6s ease';
                    b.style.height = barHeights[i];
                }, i * 80);
            });
            barObserver.disconnect();
        }
    });
}, { threshold: 0.5 });
const chartEl = document.querySelector('.bar-chart');
if (chartEl) barObserver.observe(chartEl);

// ===== GSAP HOW IT WORKS =====
if (typeof gsap !== 'undefined' && document.querySelector('.howitworks') && window.innerWidth > 768) {
    gsap.registerPlugin(ScrollTrigger);

    const slides = document.querySelectorAll('.hiw-slide');
    const dots = document.querySelectorAll('.hiw-dot');
    const hiwBgs = document.querySelectorAll('.hiw-bg');
    const progressBar = document.querySelector('.hiw-progress-bar');
    const totalSlides = slides.length;
    let currentIndex = -1;

    function activateSlide(index) {
        if (index === currentIndex) return;
        currentIndex = index;

        hiwBgs.forEach(bg => bg.classList.remove('active'));
        if (hiwBgs[index]) hiwBgs[index].classList.add('active');

        slides.forEach(s => {
            const inner = s.querySelector('.hiw-slide-inner');
            gsap.killTweensOf(inner);
            gsap.set(inner, { autoAlpha: 0, y: 20 });
            s.classList.remove('active');
            s.style.pointerEvents = 'none';
        });
        dots.forEach(d => d.classList.remove('active'));

        slides[index].classList.add('active');
        slides[index].style.pointerEvents = 'all';
        dots[index].classList.add('active');

        const inner = slides[index].querySelector('.hiw-slide-inner');
        gsap.fromTo(inner,
            { autoAlpha: 0, y: 30 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out', delay: 0.05 }
        );

        if (progressBar) {
            gsap.to(progressBar, {
                width: ((index + 1) / totalSlides * 100) + '%',
                duration: 0.4,
                ease: 'power2.out'
            });
        }
    }

    activateSlide(0);

    ScrollTrigger.create({
        trigger: '.howitworks',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
            const index = Math.min(
                Math.floor(self.progress * totalSlides),
                totalSlides - 1
            );
            activateSlide(index);
        }
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            const section = document.querySelector('.howitworks');
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const targetScroll = sectionTop + (i / totalSlides) * sectionHeight;
            window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        });
    });
}