import courseModel from "../../models/course/course.js"
import lectureModel from "../../models/course/courseLecture.js";
import courseOverviewModel from "../../models/course/courseOverview.js";
import courseRequestModel from "../../models/course/courseRequest.js";
import courseSectionModel from "../../models/course/courseSection.js";

export const createCourse = async (req, res) => {
  try {
    const {
      category_id,
      provider_id,
      course_title,
      price
    } = req.body;

    if (!category_id || !provider_id || !course_title || price === undefined) {
      return res.status(400).send({
        message: "Missing required fields"
      });
    }

    const newCourse = await courseModel.create(req.body);

    return res.status(201).send({
      message: "Tạo course thành công",
      course: newCourse
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};



export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Tìm course
    const course = await courseModel.findById(id);

    if (!course) {
      return res.status(404).send({
        message: "Không tìm thấy khóa học"
      });
    }

    // 2. Lấy request
    const requests = await courseRequestModel.find({ course_id: id });

    // 3. Lấy overview
    const overviews = await courseOverviewModel.find({ course_id: id });

    // 4. Lấy sections
    const sections = await courseSectionModel.find({ course_id: id });

    // 5. Lấy lectures theo section
    const sectionsWithLectures = await Promise.all(
      sections.map(async (section) => {
        const lectures = await lectureModel.find({
          section_id: section._id
        });

        return {
          ...section._doc,
          lectures
        };
      })
    );

    // 6. Trả về full data
    return res.status(200).send({
      message: "Lấy chi tiết khóa học thành công",
      data: {
        course,
        request: requests,
        overview: overviews,
        sections: sectionsWithLectures
      }
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};
