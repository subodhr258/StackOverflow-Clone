import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import imageRoutes from "./routes/image.js";

const app = express();
dotenv.config();
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("This is a StackOverflow clone API");
});

app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);
app.use("/posts", imageRoutes);
const PORT = process.env.PORT || 5000;

// const DATABASE_URL = process.env.CONNECTION_URL;
mongoose.set("strictQuery", true);

// mongoose
//   .connect(DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() =>
//     app.listen(PORT, () => console.log(`server running on port ${PORT}`))
//   )
//   .catch((err) => console.log(err.message));

const mongoURI = process.env.CONNECTION_URL;
const conn = mongoose.createConnection(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
let gfs;
conn.once("open", () => {
  app.listen(PORT, () => console.log(`server running on port ${PORT}`))
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "images",
  });
});


