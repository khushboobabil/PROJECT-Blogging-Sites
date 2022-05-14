const AuthorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")
const validator = require('./validator')
const authorModel = require("../models/authorModel.js")
const blogModel = require("../models/blogModel")


const createAuthor = async function (req, res) {
    try {
        const requestBody = req.body
        const queryParams = req.query

        if (!validator.queryParams(queryParams)) {
            return res.status(400).send({ status: false, message: 'page not found' })
        }

        if (!validator.requestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'data is required' })
        }

        const { firstName, lastName, title, email, password } = requestBody

        if (!validator.isValid(firstName)) {
            return res.status(400).send({ status: false, message: 'firstName is required' })
        }

        if (!validator.isValidString(firstName)) {
            return res.status(400).send({ status: false, message: 'valid firstName required' })
        }

        if (!validator.isValid(lastName)) {
            return res.status(400).send({ status: false, message: 'lastName is required' })
        }

        if (!validator.isValidString(lastName)) {
            return res.status(400).send({ status: false, message: 'valid lastName required' })
        }

        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: 'title is required' })
        }

        if (!validator.isValidTitle(title)) {
            return res.status(400).send({ status: false, message: 'title should be among "Mr", "Mrs", "Miss" ' })
        }
        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "email address must be a valid" })
        }
        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: 'password is required' })
        }

        if (!validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, message: 'valid password is required' })
        }

        const isDublicateEmail = await authorModel.findOne({ email })
        if (isDublicateEmail) {
            return res.status(400).send({ status: false, message: 'email already exist' })
        }

        const authorCreated = await AuthorModel.create(requestBody)
        res.status(201).send({ status: true, message: 'Author created successfully', data: authorCreated })
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}


const loginauthor = async function (req, res) {
    try {
        const requestBody = req.body
        const queryParams = req.query


        if (!validator.queryParams(queryParams)) {
            return res.status(400).send({ status: false, message: 'page not found' })
        }
        if (!validator.requestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'data is required' })
        }

        const { email, password } = requestBody

        if (!validator.isValidEmail(email)) {
            return res.status(400).send({ status: false, message: "email address must be a valid" })
        }

        if (!validator.isValid(password)) {
            return res.status(400).send({ status: false, message: 'password is required' })
        }
        if (!validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, message: 'valid password is required' })
        }

        const author = await AuthorModel.findOne({ email, password })
        if (!author) {
            return res.status(404).send({ status: false, mssg: "username or password is not valid" })
        }

        const token = jwt.sign({ authorid: author._id }, "Screct-key");
        res.setHeader("x-api-key", token);
        res.status(200).send({ status: true, message: 'Author login successfull', data: token });
    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ msg: error.message })
    }
};


module.exports.createAuthor = createAuthor
module.exports.loginauthor = loginauthor