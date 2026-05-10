import  { Router } from "express";
import { approveProvider, createProvider, getPendingProviders } from "../controllers/provider.js";

import authMiddleware  from "../middleware/auth.js";
const routerProvider = Router();

routerProvider.post("/providers/register", authMiddleware, createProvider);

routerProvider.get(
  "/admin/providers/pending",
  authMiddleware,
  getPendingProviders
);


routerProvider.put(
  "/admin/providers/:providerId/approve",
  authMiddleware,
  approveProvider
);

export default routerProvider;

