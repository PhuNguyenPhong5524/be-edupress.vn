
import {Router} from "express";
import { createCourse, deleteCourse, getAllCourse, getAllCourseOfProvider, getCourseById, UpdateCourse } from "../controllers/course/course.js";
import { createCourseRequest } from "../controllers/course/courseRequest.js";
import { createCourseOverview } from "../controllers/course/courseOverView.js";
import { createCourseSection, deleteCourseSection, updateCourseSection } from "../controllers/course/courseSection.js";
import { createCourseLecture } from "../controllers/course/courseLecture.js";

import authorizeRole  from "../middleware/authorizeRole.js";
import authMiddleware  from "../middleware/auth.js";

const routerCourse = Router();

routerCourse.post("/courses", authMiddleware, authorizeRole('provider'), createCourse);
routerCourse.post("/course-request", createCourseRequest);
routerCourse.post("/course-overview", createCourseOverview);
routerCourse.post("/courses/:courseId/course-sections",authMiddleware, authorizeRole('provider'), createCourseSection);
routerCourse.post("/course-lectures", createCourseLecture);
routerCourse.post(
  "/sections/:sectionId/lectures",
  authMiddleware,
  createCourseLecture
);
routerCourse.get("/courses", getAllCourse);
routerCourse.get(
  "/my-courses",
  authMiddleware,
  authorizeRole("provider"),
  getAllCourseOfProvider
);

routerCourse.get("/courses/:id", getCourseById);
routerCourse.put("/courses/:id", authMiddleware, authorizeRole('provider'), UpdateCourse);

routerCourse.put("/courses/:courseId/course-sections/:sectionId",
  authMiddleware,
  authorizeRole("provider"),
  updateCourseSection
);

routerCourse.delete("/courses/:id", authMiddleware, authorizeRole('provider'), deleteCourse);
routerCourse.delete(
  "/courses/:courseId/sections/:sectionId",
  authMiddleware,
  deleteCourseSection
);
export default routerCourse;