import { Router } from "express";
import { createCategory } from "../controllers/category.js";

const categoryRouter = Router();


categoryRouter.post('/categories', createCategory);

export default categoryRouter;