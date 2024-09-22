const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Blog = require("./models/blog");

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// const dbURI = "Your Link";
const dbURI = "mongodb+srv://admin:Admin1234@cluster0.cfzga.mongodb.net/nodejs-app?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(dbURI)
  .then((result) => {
    console.log("Connected to db");
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://127.0.0.1:${PORT}`);
    });
  })
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/news", (req, res) => {
  Blog.find()
    .sort({ createdAt: -1 })
    .then((result) => {
      res.render("news", { blogs: result, title: "News" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About" });
});

app.get("/games", (req, res) => {
  res.render("games", { title: "Games" });
});

app.get("/content-guidelines", (req, res) => {
  res.render("content-guidelines", { title: "Content Guidelines" });
});


app.get("/blogs/create", (req, res) => {
  res.render("create", { title: "Create a new blog" });
});

app.post("/blogs", urlencodedParser, (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    snippet: req.body.snippet,
    body: req.body.body
  });

  blog
    .save()
    .then((result) => {
      res.redirect("/news");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then((result) => {
      res.render("details", { blog: result, title: "Blog Details" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.delete("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then((result) => {
      res.json({ redirect: "/news" });
    })
    .catch((err) => {
      console.log(err);
    });
});

// app.get("/add-blog", (req, res) => {
//   const blog = new Blog({
//     title: "new blog 4",
//     snippet: "about my new blog",
//     body: "more about my new blog",
//   });

//   blog
//     .save()
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.get("/single-blog", (req, res) => {
  Blog.findById('66dbd9186041579c6dfb373a')
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "404" });
});
