
import {Router} from "express";
import { createCourse, getAllCourse, getCourseById } from "../controllers/course/course.js";
import { createCourseRequest } from "../controllers/course/courseRequest.js";
import { createCourseOverview } from "../controllers/course/courseOverView.js";
import { createCourseSection } from "../controllers/course/courseSection.js";
import { createCourseLecture } from "../controllers/course/courseLecture.js";

import authorizeRole  from "../middleware/authorizeRole.js";
import authMiddleware  from "../middleware/auth.js";

const routerCourse = Router();

routerCourse.post("/courses", authMiddleware, authorizeRole('provider'), createCourse);
routerCourse.post("/course-request", createCourseRequest);
routerCourse.post("/course-overview", createCourseOverview);
routerCourse.post("/course-sections", createCourseSection);
routerCourse.post("/course-lectures", createCourseLecture);
routerCourse.get("/courses", getAllCourse);
routerCourse.get("/courses/:id", getCourseById);


export default routerCourse;