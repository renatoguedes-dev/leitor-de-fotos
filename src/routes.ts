import { Router } from "express";
import upload from "./utils/storage";

import UploadController from "./controllers/UploadController";
import ConfirmController from "./controllers/ConfirmController";
import MeasureListController from "./controllers/MeasureListController";

const uploadController = new UploadController();
const confirmController = new ConfirmController();
const measureListController = new MeasureListController();

const routes = Router();

routes.post("/upload", upload.single("image"), uploadController.processImage);
routes.patch("/confirm", confirmController.confirmOrUpdate);
routes.get("/:customer_code/list", measureListController.getAll);

export default routes;
