import express from "express";
import { login } from "../controllers/login.js";

const routerLogin = express.Router();

routerLogin.post("/login", login);

export default routerLogin;