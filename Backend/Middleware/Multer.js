import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export {upload}
//router.post("/upload", upload.single("file"), parseCreditReport);