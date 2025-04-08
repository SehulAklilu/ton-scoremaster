export const getTelegramUserData = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const authData = Object.fromEntries(urlParams.entries());

    return authData;
};
