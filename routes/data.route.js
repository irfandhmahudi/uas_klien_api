import express from "express";
import {
  createDisaster,
  getAllDisasters,
  getDisasterById,
  updateDisaster,
  deleteDisaster,
} from "../controllers/data.controller.js";
import upload from "../middleware/upload.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add", upload.array("images", 1), authMiddleware, createDisaster);
router.get("/", authMiddleware, getAllDisasters);
router.get("/:id", authMiddleware, getDisasterById);
router.patch("/:id", upload.array("images", 1), authMiddleware, updateDisaster);
router.delete("/:id", authMiddleware, deleteDisaster);

export default router;
