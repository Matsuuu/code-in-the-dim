/**
 * @param {string} key
 * @param {string} value
 */
export function setUrlParam(key, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);

    window.history.pushState({}, null, url);
}

/**
 * @param {string} key
 */
export function getUrlParam(key) {
    const url = new URL(window.location.href);

    return url.searchParams.get(key);
}
