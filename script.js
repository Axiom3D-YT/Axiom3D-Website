window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    const header = document.querySelector('header');
    const main = document.querySelector('main');

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
});