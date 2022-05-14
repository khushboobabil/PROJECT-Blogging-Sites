const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel")

const authenticate = function (req, res, next) {
    const token = req.headers["x-api-key"];
    if (!token) {
        return res.send({ status: false, mssg: "token must be present" });
    }

    const decodedtoken = jwt.verify(token, "Screct-key");
    if (!decodedtoken) {
        return res.send({ status: false, mssg: "invalid token" })
    }
    next()
}

const authorisation = async function (req, res, next) {

    const blogId = req.params.blogId
    const findingBlog = await blogModel.findById(blogId)
    if (!(findingBlog && findingBlog.isDeleted == false)) {
        return res.status(400).send("Blog id is not valid")
    }
    const authortobemodified = findingBlog.authorId
    const token = req.headers["x-api-key"];
    if (!token) {
        return res.send({ status: false, mssg: "token must be present" });
    }

    const decodedtoken = jwt.verify(token, "Screct-key");
    if (!decodedtoken) {
        return res.send({ status: false, mssg: "invalid token" })
    }
    const userloggedin = decodedtoken.authorid

    if (authortobemodified != userloggedin) {
        return res.send({ status: false, msg: "user is not allowed to modify other's blog" })
    }

    next()
}

module.exports.authenticate = authenticate
module.exports.authorisation = authorisation