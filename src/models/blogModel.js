const mongoose = require("mongoose")
const objectId = mongoose.Schema.Types.ObjectId
const blogs = new mongoose.Schema({

    "title": {
        type: String,
        required: 'Blog title is required',
        trim: true
    },
    "body": {
        type: String,
        required: 'Blog body is requird',
        trim: true
    },
    "authorId": {
        type: objectId,
        ref: "collectionOfAuthor",
        required: 'authorId is required'
    },
    "tags": [String],
    "category": {
        type: String,
        required: 'Blog category is required',
        trim: true
    },
    "subcategory": [String],
    "isPublished": {
        type: Boolean,
        default: false
    },
    "publishedAt": Date, 
    "isDeleted": {
        type: Boolean,
        default: false
    },
    "deletedAt": {
        type: Date, 
        default: null
    }
}, { timestamps: true })

module.exports = mongoose.model("collectionOfBlog", blogs)