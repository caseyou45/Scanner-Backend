import { Router } from "express";

import { getByURLQuery } from "../controller/api/call";
const router = Router();

// router.get("/all", CallController.getAll);
router.get("/", getByURLQuery);

export default router;
