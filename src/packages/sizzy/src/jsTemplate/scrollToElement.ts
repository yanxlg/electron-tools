(() => {
    const element = document.querySelector('#selector');
    if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset + rect.top;
        window.scroll({
            left: 0,
            top: scrollTop,
            behavior: 'smooth',
        });
    }
})();
