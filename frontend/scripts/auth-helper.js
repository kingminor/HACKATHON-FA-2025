export const authFetch = (url, options = {}) =>
{
    const token = sessionStorage.getItem("jwt") || "";
    const headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    return fetch(url, { ...options, headers});
};