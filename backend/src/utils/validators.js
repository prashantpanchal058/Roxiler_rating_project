const validateName = (name) => {
    return typeof name === "string" &&
        name.length >= 10 &&
        name.length <= 60;
};

const validateAddress = (address) => {
    return typeof address === "string" &&
        address.length <= 400;
};

const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePassword = (password) => {
    return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password);
};

module.exports = {
    validateName,
    validateAddress,
    validateEmail,
    validatePassword
};