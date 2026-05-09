import { Router } from "express";
import { createCategory, getAllCategory } from "../controllers/category.js";

const categoryRouter = Router();


categoryRouter.post('/categories', createCategory);
categoryRouter.get('/categories', getAllCategory);


export default categoryRouter;