const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const validator = require('./validator')


const createblog = async function (req, res) {
    try {
        const requestBody = req.body
        const queryParams = req.query

        if (!validator.requestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'data is required' })
        }

        if (!validator.queryParams(queryParams)) {
            return res.status(400).send({ status: false, message: 'page not found' })
        }

        const { title, body, authorId, tags, category, subcategory, isPublished, isDeleted } = requestBody

        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: 'title is required' })
        }

        if (!validator.isValidString(title)) {
            return res.status(400).send({ status: false, message: 'title must be in valid formate' })
        }

        if (!validator.isValid(body)) {
            return res.status(400).send({ status: false, message: 'body is required' })
        }

        if (!validator.isValid(authorId)) {
            return res.status(400).send({ status: false, message: 'authorid is required' })
        }

        if (!validator.isValidObjectId(authorId)) {
            return res.status(400).send({ status: false, message: 'invalid authorid ' })
        }

        if (!validator.isValid(tags)) {
            return res.status(400).send({ status: false, message: 'tags required' })
        }

        if (!validator.isValid(category)) {
            return res.status(400).send({ status: false, message: 'category required' })
        }

        if (!validator.isValidString(category)) {
            return res.status(400).send({ status: false, message: 'category must be in valid formate' })
        }

        if (!validator.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: 'subcategory required' })
        }

        if (isPublished === true) {
            requestBody["publishedAt"] = new Date()
        }

        let isAuthorExist = await authorModel.findById(authorId)
        if (!isAuthorExist) {
            return res.status(400).send({ status: false, message: "authorId not exist" })
        }
        if (isDeleted) {
            requestBody["isDeleted"] = false
        }

        let blogCreated = await blogModel.create(requestBody)
        res.status(201).send({ status: true, message: 'blog created sucessfully', data: blogCreated })

    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message })

    }
}


const getblog = async function (req, res) {
    try {
        const queryParams = req.query

        const fillterBlog = {
            isDeleted: false,
            isPublished: true
        }

        const { authorId, category, tags, subcategory } = queryParams

        if (authorId) {
            if (!validator.isValidObjectId(authorId)) {
                return res.status(400).send({ status: false, message: 'invalid authorid ' })
            }
            fillterBlog['authorId'] = authorId
        }

        if (category) {
            fillterBlog['category'] = category
        }

        if (tags) {
            fillterBlog['tags'] = tags
        }

        if (subcategory) {
            fillterBlog['subCategory'] = subcategory
        }

        const blogs = await blogModel.find(fillterBlog).populate("authorId")

        if (blogs.length == 0) {
            return res.status(404).send({ status: false, message: "No blogs Available." })
        }
        res.status(200).send({ status: true, data: blogs });
    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message });
    }
}

const updateblog = async function (req, res) {

    const blogId = req.params.blogId
    const requestBody = req.body
    const queryParams = req.query

    if (!validator.queryParams(queryParams)) {
        return res.status(400).send({ status: false, message: 'page not found' })
    }

    const updateBlog = {
        isDeletted: false
    }

    const { title, body, tags, subcategory, isPublished } = requestBody

    const blogExist = await blogModel.findById(blogId)
    if (!blogExist) {
        return res.status(400).send({ status: false, message: 'Blog not exist' })
    }

    const isBlogExist = blogExist.isDeleted
    if (isBlogExist == true) {
        return res.status(404).send({ status: false, message: "blog has been already deleted" })
    }

    if (title) {
        if (!validator.isValid(title)) {
            return res.status(400).send({ status: false, message: 'title is required' })
        }

        if (!validator.isValidString(title)) {
            return res.status(400).send({ status: false, message: 'title must be in valid formate' })
        }
        updateBlog['title'] = title
    }


    if (body) {
        if (!validator.isValid(body)) {
            return res.status(400).send({ status: false, message: 'body is required' })
        }

        updateBlog['body'] = body
    }

    if (tags) {
        if (!validator.isValid(tags)) {
            return res.status(400).send({ status: false, message: 'tags required' })
        }
        updateBlog['tags'] = tags
    }

    if (subcategory) {
        if (!validator.isValid(subcategory)) {
            return res.status(400).send({ status: false, message: 'subcategory required' })
        }
        updateBlog['subcategory'] = subcategory
    }

    if (isPublished) {
        if (typeof isPublished != Boolean) {
            return res.status(400).send({ status: false, message: 'isPublished shoud be true or false' })
        }
        updateBlog['isPublished'] = isPublished
    }

    if (isPublished === true) {
        requestBody["publishedAt"] = new Date()
    }

    const updated = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: updateBlog }, { new: true })
    res.status(200).send({ status: true, data: updated });
}



const deleteblog = async function (req, res) {
    try {

        const queryParams = req.query
        const Blogid = req.params.blogId

        if (!validator.queryParams(queryParams)) {
            return res.status(400).send({ status: false, message: 'page not found' })
        }

        const isBlogExist = await blogModel.findOne({ _id: Blogid })
        if (!(isBlogExist && isBlogExist.isDeleted == false)) {
            return res.status(404).send({ status: false, message: 'Blog not exist' })
        }

        if (isBlogExist.isDeleted == false) {
            const deleteBlog = await blogModel.findOneAndUpdate({ _id: Blogid }, { isDeleted: true, deletedAt: new Date() }, { new: true })

            return res.status(200).send({ status: true, message: "blog deleted successfuly" })
        } else {
            res.status(404).send({ status: false, message: 'Blog has already deleted' })
        }

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}


const deleteByElement = async function (req, res) {
    try {
        const queryParams = req.query

        if (Object.keys(queryParams) == 0) {
            return res.status(400).send({ status: false, message: "not a vaild input" })
        }

        const isBlogExist = await blogModel.find(queryParams)
        if (isBlogExist.length == 0) {
            return res.status(404).send({ status: false, message: 'Blog not able to delete' })
        }


        const deleteBlogByQuery = await blogModel.updateMany({ isBlogExist, isDeleted: false, isPublished: false }, { $set: { isDeleted: true, deletedAt: new Date() } })
        if (deleteBlogByQuery.modifiedCount == 0) {
            return res.status(400).send({ status: false, message: 'user already deleted' })
        }

        if (!deleteBlogByQuery) {
            return res.status(404).send({ status: false, message: "blog not exist" })
        } else {
            res.status(200).send({ status: true, message: deleteBlogByQuery })
        }
    }

    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message });
    }
};


module.exports.createblog = createblog
module.exports.getblog = getblog
module.exports.updateblog = updateblog
module.exports.deleteblog = deleteblog
module.exports.deleteByElement = deleteByElement