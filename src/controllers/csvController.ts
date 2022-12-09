import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import { parse } from "json2csv";

class CsvController {
  public async getCsv(req: Request, res: Response) {
    const users = await UserModel.find();
    const fields = ["user_id", "username", "date", "punch_in", "punch_out"];
    const opts = { fields };
    try {
      const csv = parse(users, opts);
      res.setHeader("Content-disposition", "attachment; filename=users.csv");
      res.set("Content-Type", "text/csv");
      res.status(200).send(csv);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new CsvController();
