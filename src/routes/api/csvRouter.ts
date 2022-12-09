import { Router } from "express";
import CsvController from "../../controllers/csvController";

const csvRouter = Router();

csvRouter.get("/", CsvController.getCsv);

export default csvRouter;
