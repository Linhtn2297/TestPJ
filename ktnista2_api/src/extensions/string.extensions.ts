interface String {
    isNotContainSpecialChar(pre: string): boolean;
    isOnlyNumber(pre: string): boolean;
    isEmail(pre: string): boolean;
    capitalize(pre: string): string;
}

/// Check string not contain special character
String.prototype.isNotContainSpecialChar = function () {
    let specialChars = /[`!@#$%^&*()_+\-=/[\]{};':"\\|,.<>\t/?~]/;
    return !specialChars.test(String(this));
}

/// Check string is only contain number
String.prototype.isOnlyNumber = function () {
    let numbers = /^[0-9]+$/;
    return numbers.test(String(this));
}

/// Check string is email format
String.prototype.isEmail = function () {
    let emailFortmat = /^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;
    return emailFortmat.test(String(this));
}

/// Uppercase first letter of tring
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}