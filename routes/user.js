import { Router } from "express";
import { createUser, getAllUsers } from "../controllers/user.js";

const routerUser = Router();

routerUser.post('/users', createUser);
routerUser.get('/users', getAllUsers);

export default routerUser;