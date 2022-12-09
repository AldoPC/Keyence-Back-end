import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./routes/api/userRouter";
import authRouter from "./routes/api/authRouter";
import csvRouter from "./routes/api/csvRouter";
import VerifySignUp from "./middleware/VerifySignUp";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
const mongooseurl = process.env.MONGO_URI!;

mongoose
  .connect(mongooseurl)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log(err));

app.use("/api/users", VerifySignUp.verifySignUpToken, userRouter);
app.use("/api/auth", authRouter);
app.use("/api/csv", csvRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
