import { verify } from "jsonwebtoken";
import { Request, Response } from "express";

class AuthJwt {
  public async verifyToken(req: Request, res: Response) {
    const token = req.headers["x-access-token"] as string;

    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }

    verify(token, process.env.secretjwtkey!, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      req.body.userId = decoded;
    });
  }
}

export default new AuthJwt();
