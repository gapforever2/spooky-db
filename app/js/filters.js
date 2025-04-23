'use strict';

unitDb.filters = {
    unsafe: ['$sce', ($sce) => (val) => $sce.trustAsHtml(val)],
    if: () => (item, cond) => cond ? item : '',
    flatten: () => (arg) => Array.isArray(arg) ? arg.join('<br/> ') : arg,
    time: () => (timeInSec) => `${timeInSec / 60 | 0}:${String(timeInSec % 60 | 0).padStart(2, '0')}`,
    round: () => (num, places) => +num.toFixed(places),
    shorten: () => (num) => {
        if (num > 1000 * 1000 * 1000 - 1) {
            return num / (1000 * 1000 * 1000) + 'G';
        } else if (num > 1000 * 1000 - 1) {
            return num / (1000 * 1000) + 'M';
        } else if (num > 1000 - 1) {
            return num / 1000 + 'k';
        }
        return num;
    }
};
