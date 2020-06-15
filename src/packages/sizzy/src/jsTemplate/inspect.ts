// inspect效果
(() => {
    // @ts-ignore
    if (window._off_inspect) {
        return;
    }
    const __inspect_el = document.createElement('div');
    __inspect_el.style.position = 'absolute';
    __inspect_el.style.pointerEvents = 'none';
    __inspect_el.style.backgroundColor = 'rgb(78, 171, 230)';
    __inspect_el.style.opacity = '0.4';
    __inspect_el.style.zIndex = '1000000';
    __inspect_el.style.display = 'none';
    document.body.appendChild(__inspect_el);

    const __inspect_listener = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const rect = target.getBoundingClientRect();
        __inspect_el.style.width = rect.width + 'px';
        __inspect_el.style.height = rect.height + 'px';
        __inspect_el.style.left = rect.left + 'px';
        __inspect_el.style.top = rect.top + 'px';
        __inspect_el.style.display = 'block';
    };
    const __inspect_leave_listener = (e: MouseEvent) => {
        // @ts-ignore
        const from = e.relatedTarget || e.toElement;
        if (!from || from.nodeName == 'HTML') {
            __inspect_el.style.display = 'none';
        }
    };
    window.addEventListener('mousemove', __inspect_listener);

    window.addEventListener('mouseout', __inspect_leave_listener);

    // @ts-ignore
    window._off_inspect = () => {
        window.removeEventListener('mousemove', __inspect_listener);
        window.removeEventListener('mouseout', __inspect_leave_listener);
        document.body.removeChild(__inspect_el);
        // @ts-ignore
        window._off_inspect = undefined;
    };
})();
