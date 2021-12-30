const express = require("express");

const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const PostsController = require("../controllers/posts");

router.post("", checkAuth, extractFile, PostsController.createPost);

router.put("/:id", checkAuth, extractFile, PostsController.updatePost);

router.get("/", PostsController.getAllPosts);

router.get("/:id", PostsController.getPostById);

router.delete("/:id", checkAuth, PostsController.deletePost);

module.exports = router;
