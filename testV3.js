const getAllSelectors = require('./Engine/allSelectorAfterLogin');

// Contoh penggunaan:
(async () => {
    const url = 'https://practicetestautomation.com/practice-test-login';
    const username = 'student';
    const password = 'Password123';
    const usernameSelector = '#username';
    const passwordSelector = '#password';
    const submitButtonSelector = '#submit';
    const targetUrl = 'https://practicetestautomation.com/logged-in-successfully/';

    const selectors = await getAllSelectors(url, username, password, usernameSelector, passwordSelector, submitButtonSelector, targetUrl);
    console.log(selectors);
})();
