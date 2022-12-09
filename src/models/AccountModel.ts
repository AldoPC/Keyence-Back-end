import { Schema, model } from "mongoose";
import Account from "../interfaces/Account";

const AccountSchema = new Schema<Account>({
  username: String,
  email: String,
  password: String,
  date: { type: Date, default: Date.now },
});

const AccountModel = model<Account>("Account", AccountSchema);

export default AccountModel;
