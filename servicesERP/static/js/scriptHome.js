document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const offsetTop = target.getBoundingClientRect().top;
            window.scrollBy({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });

    let lastScrollTop = 0;
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", function () {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > lastScrollTop) {
            // El usuario está haciendo scroll hacia abajo
            navbar.style.top = `-${navbar.offsetHeight}px`;
        } else {
            // El usuario está haciendo scroll hacia arriba
            navbar.style.top = "0";
        }

        lastScrollTop = currentScroll;
    });

    window.addEventListener('scroll', function () {
        var navbar = document.getElementById('mainNavbar');
        var scrollPosition = window.scrollY;

        if (scrollPosition > 100) {
            navbar.classList.add('white-bg');
        } else {
            navbar.classList.remove('white-bg');
        }
    });

});
