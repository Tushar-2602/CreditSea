import express from "express";
import { upload } from "../Middleware/Multer.js";
import { uploadXml } from "../Controller/Upload.js";
import { sendData } from "../Controller/Retrieve.js";
const router = express.Router();

// POST /api/upload
router.post("/uploadData", upload.single("file"),uploadXml);
router.get("/getData",sendData);

export default router;
