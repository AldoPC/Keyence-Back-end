import AccountModel from "../models/AccountModel";
import { Request, Response } from "express";
import { sign, decode } from "jsonwebtoken";
import bcrypt from "bcrypt";

class AuthController {
  public async signUp(req: Request, res: Response) {
    const emailExists = await AccountModel.findOne({ email: req.body.email });
    const salt = 10;

    if (emailExists)
      return res.status(400).send({ message: "Email already exists" });

    const account = new AccountModel({
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, salt),
    });
    account.save((err, account) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (account) {
        const token = sign(
          { username: account.username, id: account._id },
          process.env.secretjwtkey!
        );
        res.header("auth-token", token).json({
          error: null,
          data: { token },
        });
      }
    });
  }
  public async signIn(req: Request, res: Response) {
    const account = await AccountModel.findOne({ email: req.body.email });
    if (!account)
      return res.status(404).send({ message: "Invalid credentials." });
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      account.password
    );
    if (!passwordIsValid)
      return res.status(404).send({ message: "Invalid credentials." });
    const token = sign(
      { username: account.username, id: account._id },
      process.env.secretjwtkey!
    );
    res.header("auth-token", token).json({
      error: null,
      data: { token },
    });
  }
  public async getAccount(req: Request, res: Response) {
    const token = req.headers["auth-token"];
    const decoded = decode(token as string, { json: true });
    try {
      const account = await AccountModel.findById(decoded?.id);
      if (!account)
        return res.status(404).send({ message: "Account not found." });
      res.status(200).json(account);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  public async getAccountById(req: Request, res: Response) {
    try {
      const account = await AccountModel.findById(req.params.id);
      if (!account)
        return res.status(404).send({ message: "Account not found." });
      res.status(200).json(account);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  public async updateAccount(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const account = await AccountModel.findOneAndUpdate(
        { _id: id },
        req.body
      );
      if (!account) res.status(404).send("Account not found");
      res.status(200).json({ message: "Account updated" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new AuthController();
