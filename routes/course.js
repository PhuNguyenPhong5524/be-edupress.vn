
import {Router} from "express";
import { createCourse, deleteCourse, getAllCourse, getAllCourseOfProvider, getCourseById, getFeaturedCourses, UpdateCourse } from "../controllers/course/course.js";
import { createCourseRequest, updateCourseRequest } from "../controllers/course/courseRequest.js";
import { createCourseOverview, updateCourseOverview } from "../controllers/course/courseOverView.js";
import { createCourseSection, deleteCourseSection, updateCourseSection } from "../controllers/course/courseSection.js";
import { createCourseLecture, deleteCourseLecture, updateCourseLecture } from "../controllers/course/courseLecture.js";

import authorizeRole  from "../middleware/authorizeRole.js";
import authMiddleware  from "../middleware/auth.js";

const routerCourse = Router();

routerCourse.get("/courses", getAllCourse);
routerCourse.get("/courses/featured", getFeaturedCourses);
routerCourse.get(
  "/my-courses",
  authMiddleware,
  authorizeRole("provider"),
  getAllCourseOfProvider
);

routerCourse.get("/courses/:id", getCourseById);

routerCourse.post("/courses", authMiddleware, authorizeRole('provider'), createCourse);
routerCourse.post("/courses/:courseId/course-sections",authMiddleware, authorizeRole('provider'), createCourseSection);
routerCourse.post("/course-lectures", createCourseLecture);
routerCourse.post(
  "/sections/:sectionId/lectures",
  authMiddleware,
  authorizeRole("provider"),
  createCourseLecture
);
routerCourse.post(
  "/courses/:courseId/overviews",
  authMiddleware,
  authorizeRole("provider"),
  createCourseOverview
);

routerCourse.post(
  "/courses/:courseId/requests",
  authMiddleware,
  authorizeRole("provider"),
  createCourseRequest
);



routerCourse.put(
  "/courses/:courseId/overviews/:overviewId",
  authMiddleware,
  authorizeRole("provider"),
  updateCourseOverview
);

routerCourse.put(
  "/lectures/:lectureId",
  authMiddleware,
  authorizeRole("provider"),
  updateCourseLecture
);

routerCourse.put("/courses/:id", authMiddleware, authorizeRole('provider'), UpdateCourse);

routerCourse.put("/courses/:courseId/course-sections/:sectionId",
  authMiddleware,
  authorizeRole("provider"),
  updateCourseSection
);


routerCourse.put(
  "/courses/requests/:courseRequestId",
  authMiddleware,
  authorizeRole("provider"),
  updateCourseRequest
);



routerCourse.delete("/courses/:id", authMiddleware, authorizeRole('provider'), deleteCourse);
routerCourse.delete(
  "/courses/:courseId/sections/:sectionId",
  authMiddleware,
  authorizeRole("provider"),
  deleteCourseSection
);

routerCourse.delete(
  "/lectures/:lectureId",
  authMiddleware,
  authorizeRole("provider"),
  deleteCourseLecture
);

export default routerCourse;