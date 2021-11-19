const express = require("express");

const app = express();

app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: 1,
      title: "First sever-side post",
      content: "This is coming from the server",
    },
    {
      id: 2,
      title: "Second sever-side post",
      content: "This is coming from the server!",
    },
  ];
  res.json({
    message: "Posts fetched successfully!",
    posts: posts,
  });
});

module.exports = app;
