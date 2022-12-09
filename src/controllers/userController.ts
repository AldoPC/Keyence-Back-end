import UserModel from "../models/UserModel";
import { Request, Response } from "express";
import excelToJson from "convert-excel-to-json";
import { parse } from "json2csv";
import fs from "fs";

import type User from "../interfaces/User";

class UserController {
  public async getUsers(req: Request, res: Response) {
    try {
      const users = await UserModel.find();
      if (!users) res.status(404).send("No users found");
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  public async getUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await UserModel.findById(id);
      if (!user) res.status(404).send("User not found");
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  public async createUser(req: Request, res: Response) {
    const user = new UserModel(req.body);
    try {
      const newUser = await user.save();
      if (!newUser) res.status(400).send("User not created");
      res.status(200).json(newUser);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  public async createUsersFromFile(req: Request, res: Response) {
    const users = [] as User[];
    const file = req.body.fileData;
    const buffer = Buffer.from(
      file.replace(
        "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,",
        ""
      ),
      "base64"
    );
    const result = excelToJson({
      source: buffer,
    });

    result.Sheet1.slice(1).forEach(function (cells) {
      const punch_in = new Date(cells.D);
      const punch_out = new Date(cells.E);
      const date = new Date(cells.C);
      const punch_in_hour = mod(punch_in.getHours() - 23, 24)
        .toString()
        .padStart(2, "0");
      const punch_in_minute = mod(punch_in.getMinutes() - 24, 60)
        .toString()
        .padStart(2, "0");
      const punch_out_hour = mod(punch_out.getHours() - 23, 24)
        .toString()
        .padStart(2, "0");
      const punch_out_minute = mod(punch_out.getMinutes() - 24, 60)
        .toString()
        .padStart(2, "0");

      const user = {
        user_id: cells.A as number,
        username: cells.B as string,
        date: `${date.getFullYear().toString().padStart(2, "0")}-${(
          date.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`,
        punch_in: `${punch_in_hour}:${punch_in_minute}`,
        punch_out: `${punch_out_hour}:${punch_out_minute}`,
      };

      users.push(user);
    });
    try {
      const newUsers = await UserModel.insertMany(users);
      if (!newUsers) res.status(400).send("Users not created");
      res.status(200).json(newUsers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  public async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await UserModel.findByIdAndDelete(id);
      if (!user) res.status(404).send("User not found");
      res.status(200).json({ message: "User deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  public async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await UserModel.findOneAndUpdate({ _id: id }, req.body);
      if (!user) res.status(404).send("User not found");
      res.status(200).json({ message: "User updated" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}
export default new UserController();
function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
