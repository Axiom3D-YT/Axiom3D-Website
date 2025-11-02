window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    const header = document.querySelector('header');
    const main = document.querySelector('main');

    setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => {
            splash.style.display = 'none';
            header.style.opacity = '1';
            main.style.opacity = '1';
            document.body.style.overflow = 'auto';
        }, 1000);
    }, 3000);
});
