import  { Router } from "express";
import { createProvider } from "../controllers/provider.js";

const routerProvider = Router();

routerProvider.post("/providers", createProvider);


export default routerProvider;

