window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    const header = document.querySelector('header');
    const main = document.querySelector('main');
    const aboutBtn = document.getElementById('about-btn');
    const aboutModal = document.getElementById('about-modal');
    const closeBtn = document.querySelector('.close-btn');

    const showMainContent = () => {
        if (splash.style.opacity !== '0') {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
                header.style.opacity = '1';
                main.style.opacity = '1';
                document.body.style.overflow = 'auto';
            }, 1000);
        }
    };

    const splashTimeout = setTimeout(showMainContent, 10000);

    splash.addEventListener('click', () => {
        clearTimeout(splashTimeout);
        showMainContent();
    });

    aboutBtn.addEventListener('click', () => {
        aboutModal.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        aboutModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == aboutModal) {
            aboutModal.style.display = 'none';
        }
    });
});
