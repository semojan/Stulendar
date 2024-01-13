function isEmpty ( value){
    return !value || value.trim() === "";
}

function userDetailsAreValid (username, password, email){
    return (
        email &&
        email.includes("@") &&
        password &&
        password.trim().length >= 5 &&
        !isEmpty(username)
    );
}

function repeatPassMatch (password, repeatPass) {
    return password === repeatPass;
}

module.exports = {
    userDetailsAreValid: userDetailsAreValid,
    repeatPassMatch: repeatPassMatch
};
