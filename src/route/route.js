const express = require("express");
const router = express.Router();

const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController");
const middleware = require("../middlewares/auth.js")


router.post("/authors", authorController.createAuthor);
router.post("/login", authorController.loginauthor)

router.post("/blogs", middleware.authenticate, blogController.createblog);
router.get("/blogs", middleware.authenticate, blogController.getblog)
router.put("/blogs/:blogId", middleware.authenticate, middleware.authorisation, blogController.updateblog)
router.delete("/blogs/:blogId", middleware.authenticate, middleware.authorisation, blogController.deleteblog)
router.delete("/blogs", middleware.authenticate, blogController.deleteByElement)


module.exports = router;