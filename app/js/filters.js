'use strict';

unitDb.filters = {
    unsafe: ['$sce', ($sce) => (val) => $sce.trustAsHtml(val)],
    if: () => (item, cond) => (cond ? item : ''),
    flatten: () => (arg) => (Array.isArray(arg) ? arg.join('<br/> ') : arg),
    time: () => (timeInSec) => `${(timeInSec / 60) | 0}:${String(timeInSec % 60 | 0).padStart(2, '0')}`,
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
    },
    where: () => (items, criteria) =>
        items?.filter((item) => Object.keys(criteria).every((key) => item[key] === criteria[key])),
    pick: () => (obj, keys) => {
        const result = {};
        keys?.forEach((key) => {
            if (obj.hasOwnProperty(key)) {
                result[key] = obj[key];
            }
        });
        return result;
    },
    sortBy: () => (items, field) => items?.sort((a, b) => (a[field] > b[field] ? 1 : -1)),
};
