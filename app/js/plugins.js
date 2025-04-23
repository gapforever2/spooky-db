'use strict';
// avoid `console` errors in browsers that lack a console.
((window) => {
    const console = (window.console = window.console || {});
    const noop = () => {};
    const consoleMethods = [
        'assert',
        'clear',
        'count',
        'debug',
        'dir',
        'dirxml',
        'error',
        'exception',
        'group',
        'groupCollapsed',
        'groupEnd',
        'info',
        'log',
        'markTimeline',
        'profile',
        'profileEnd',
        'table',
        'time',
        'timeEnd',
        'timeStamp',
        'trace',
        'warn',
    ];
    // only stub undefined methods
    consoleMethods.forEach((method) => {
        if (!console[method]) {
            console[method] = noop;
        }
    });
})(window);

// add helper functions to the global scope
((window) => {
    const USER_AGENT = window.navigator?.userAgent;
    const isClient = () => USER_AGENT?.includes('JavaFX') || USER_AGENT?.includes('Chrome/90.0.4430.85');
    const isWeb = () => !isClient();

    window.helpers = window.helpers || {};
    window.helpers.isClient = isClient;
    window.helpers.isWeb = isWeb;
})(window);

// add brick layout functionality
((window) => {
    const PACKED = 'data-packed';
    const initBricks = (selector) => {
        const container = document.querySelector(selector);
        if (!container) return;
        const bricksInstance = new Bricks({
            container: container,
            packed: PACKED,
            sizes: [
                { columns: 1, gutter: 1 },
                { mq: '715px', columns: 2, gutter: 1 },
                { mq: '1040px', columns: 3, gutter: 1 },
                { mq: '1365px', columns: 4, gutter: 1 },
                { mq: '1690px', columns: 5, gutter: 1 },
                { mq: '2015px', columns: 6, gutter: 1 },
                { mq: '2340px', columns: 7, gutter: 1 },
                { mq: '2665px', columns: 8, gutter: 1 },
                { mq: '2990px', columns: 9, gutter: 1 },
                { mq: '3315px', columns: 10, gutter: 1 },
            ],
        });
        bricksInstance.container = container;
        bricksInstance.resize(true);
        return bricksInstance;
    };
    const resetBricks = (container) => {
        if (!container) return;

        const items = container.querySelectorAll(`[${PACKED}]`);
        items.forEach((item) => {
            item.removeAttribute(PACKED);
            item.style.position = '';
            item.style.top = '';
            item.style.left = '';
        });
        container.style.position = '';
        container.style.height = '';
    };
    const repackBricks = (bricksInstance, style = 'bricks') => {
        if (style === 'bricks') {
            bricksInstance.resize(true);
            bricksInstance.pack();
        } else {
            bricksInstance.resize(false);
            resetBricks(bricksInstance.container);
        }
    };

    window.helpers = window.helpers || {};
    window.helpers.initBricks = initBricks;
    window.helpers.repackBricks = repackBricks;
})(window);
