import { Router } from "express";
import { createUser } from "../controllers/user.js";

const routerUser = Router();

routerUser.post('/users', createUser);


export default routerUser;