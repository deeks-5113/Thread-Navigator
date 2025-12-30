document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // General Reveal on Scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const scrollElements = document.querySelectorAll('.fade-in, .reveal-on-scroll');
    scrollElements.forEach(el => observer.observe(el));

    // Smooth Scroll for Anchor Links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Magnifying Glass Effect
    const imgWrapper = document.querySelector('.image-wrapper');
    const img = document.querySelector('.explain-img');

    if (imgWrapper && img) {
        const lens = document.createElement('div');
        lens.classList.add('magnifier-lens');
        imgWrapper.appendChild(lens);

        const zoomRatio = 1.5;

        imgWrapper.addEventListener('mousemove', (e) => {
            const rect = imgWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const lensW = lens.offsetWidth;
            const lensH = lens.offsetHeight;

            lens.style.left = `${x - lensW / 2}px`;
            lens.style.top = `${y - lensH / 2}px`;

            lens.style.backgroundImage = `url('${img.src}')`;
            lens.style.backgroundSize = `${img.width * zoomRatio}px ${img.height * zoomRatio}px`;

            const bgX = (x * zoomRatio) - (lensW / 2);
            const bgY = (y * zoomRatio) - (lensH / 2);

            lens.style.backgroundPosition = `-${bgX}px -${bgY}px`;
        });
    }
});
