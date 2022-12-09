import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

class VerifySignUp {
  public async verifySignUpToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const token = req.headers["auth-token"];
    if (!token) return res.status(401).send({ message: "No token provided." });
    try {
      const decoded = verify(token as string, process.env.secretjwtkey!);
      req.user = decoded as string;
      next();
    } catch (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
  }
}

export default new VerifySignUp();
