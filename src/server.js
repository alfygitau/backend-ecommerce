const express = require("express");
const connectDb = require("./config/connection");
const dotenv = require("dotenv").config();
let colors = require("colors");
const authRoutes = require("./api/routes/auth");
const productRoutes = require("./api/routes/product");
const blogRoutes = require("./api/routes/blog");
const brandRoutes = require("./api/routes/brand");
const colorRoutes = require("./api/routes/color");
const categoryRoutes = require("./api/routes/productcategory");
const blogCategoryRoutes = require("./api/routes/blogcategory");
const couponRoutes = require("./api/routes/coupon");
const contactMessageRoutes = require("./api/routes/contactmsg");
const uploadRoutes = require("./api/routes/upload");
const cors = require("cors");
const { notFound, errorhandler } = require("./api/middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const bodyParser = require("body-parser");
//...

connectDb();
const port = process.env.PORT || 5000;
const app = express();

// middlewares
app.use(morgan());
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/user", authRoutes);
app.use("/api/product", productRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/product-category", categoryRoutes);
app.use("/api/blog-category", blogCategoryRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/color", colorRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/message", contactMessageRoutes);
app.use("/api/upload", uploadRoutes);

// custom middlewares
app.use(notFound);
app.use(errorhandler);

app.listen(port, () => {
  console.log(`Connected to port ${port}`.green);
});
