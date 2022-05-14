const mongoose = require('mongoose')
const isValid = function (value) {

    if (typeof value === 'undefined' || typeof (value) === 'null') {
        return false
    }
    if (value.length == 0) {
        return false
    }
    if (typeof value === 'string' || "Array" && value.length > 0) {
        return true
    }
}
const requestBody = function (body) {
    if (Object.keys(body).length > 0) {
        return true
    }
}
const queryParams = function (query) {
    if (Object.keys(query).length == 0) {
        return true
    }
}

const isValidObjectId = function (value) {
    return mongoose.Types.ObjectId.isValid(value)
}

const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

const isValidPassword = function (value) {
    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9a-zA-Z]).{8,}$/.test(value.trim())) {
        return true
    }
}

const isValidEmail = function (email) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
}

const isValidString = (value) => {
    return /^[a-zA-Z -]+$/.test(value)
}

module.exports = {
    isValid,
    requestBody,
    queryParams,
    isValidObjectId,
    isValidTitle,
    isValidEmail,
    isValidPassword,
    isValidString
}