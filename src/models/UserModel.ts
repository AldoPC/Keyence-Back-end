import { Schema, model } from "mongoose";
import User from "../interfaces/User";

const UserSchema = new Schema<User>({
  user_id: { type: Number, required: true },
  username: { type: String, required: true },
  date: { type: String, required: true },
  punch_in: { type: String, required: true },
  punch_out: { type: String, required: true },
});

const UserModel = model<User>("User", UserSchema);
export default UserModel;
