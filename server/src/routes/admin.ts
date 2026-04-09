import { Router } from "express";
import { getAllUsers, getGlobalActivity } from "../controllers/admin.js";
import { authenticateToken, authorizeRole } from "../middlewares/auth.js";

const router = Router();

router.use(authenticateToken);
router.use(authorizeRole(["ADMIN"]));

router.get("/users", getAllUsers);
router.get("/activity", getGlobalActivity);

export default router;
