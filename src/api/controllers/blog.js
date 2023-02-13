const asyncHandler = require("express-async-handler");
const cloudinaryImageUpload = require("../helpers/Cloudinary");
const Blog = require("../models/Blog");
const fs = require("fs");

const createBlog = asyncHandler(async (req, res) => {
  try {
    let newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  let { id } = req.params;
  try {
    let blog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleBlog = asyncHandler(async (req, res) => {
  let { id } = req.params;
  try {
    let blog = await Blog.findById(id).populate("likes").populate("dislikes");
    let updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { numViews: 1 } },
      { new: true }
    );
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    let blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    throw new Error(error);
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    let deletedBlog = await Blog.findByIdAndDelete(id);
    res.json(deletedBlog);
  } catch (error) {
    throw new Error(error);
  }
});

const likeBlog = asyncHandler(async (req, res) => {
  let { blogId } = req.body;
  let blog = await Blog.findById(blogId);
  let loggedUserId = req?.user?._id;
  let isLiked = blog.isLiked;
  let alreadyDisliked = blog?.dislikes.find(
    (userId) => userId.toString() === loggedUserId.toString()
  );
  if (alreadyDisliked) {
    await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loggedUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
  }
  if (isLiked) {
    await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loggedUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
  } else {
    await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: loggedUserId },
        isLiked: true,
      },
      {
        new: true,
      }
    );
  }
  let newBlog = await Blog.findById(blogId);
  res.json(newBlog);
});

const dislikeBlog = asyncHandler(async (req, res) => {
  let { blogId } = req.body;
  let blog = await Blog.findById(blogId);
  let loggedUserId = req?.user?._id;
  let isDisLiked = blog.isDisliked;
  let alreadyliked = blog?.likes.find(
    (userId) => userId.toString() === loggedUserId.toString()
  );
  if (alreadyliked) {
    await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: loggedUserId },
        isLiked: false,
      },
      {
        new: true,
      }
    );
  }
  if (isDisLiked) {
    await Blog.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: loggedUserId },
        isDisliked: false,
      },
      {
        new: true,
      }
    );
  } else {
    await Blog.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: loggedUserId },
        isDisliked: true,
      },
      {
        new: true,
      }
    );
  }
  let newBlog = await Blog.findById(blogId);
  res.json(newBlog);
});

const uploadBlogImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const uploader = (path) => cloudinaryImageUpload(path, "images");
    const urls = [];
    const files = req.files;
    console.log(uploader);
    for (let file of files) {
      const { path } = file;
      let newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => file),
      },
      { new: true }
    );
    res.json(blog);
  } catch (error) {
    throw new Error(error);
  }
});
module.exports = {
  createBlog,
  updateBlog,
  getSingleBlog,
  getAllBlogs,
  deleteBlog,
  likeBlog,
  dislikeBlog,
  uploadBlogImages,
};
