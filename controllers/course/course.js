import courseModel from "../../models/course/course.js"
import lectureModel from "../../models/course/courseLecture.js";
import courseOverviewModel from "../../models/course/courseOverview.js";
import courseRequestModel from "../../models/course/courseRequest.js";
import courseSectionModel from "../../models/course/courseSection.js";

import providerModel from "../../models/provider.js";

export const createCourse = async (req, res) => {
  try {
    const {
      category_id,
      course_title,
      price,
      image_url,
      video_url,
      description,
      duration,
      student,
      feature
    } = req.body;

    if (!category_id || !course_title || price === undefined) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // LẤY userId từ token
    const userId = req.user.userId;

    // TÌM provider THEO user_id
    const provider = await providerModel.findOne({
      user_id: userId,
      status: "approved"
    });

    if (!provider) {
      return res.status(403).json({
        message: "Tài khoản chưa được duyệt làm nhà cung cấp!"
      });
    }

    // tạo course với provider._id
    const newCourse = await courseModel.create({
      category_id,
      provider_id: provider._id,
      course_title,
      price,
      image_url,
      video_url,
      description,
      duration,
      student,
      feature
    });

    return res.status(201).json({
      message: "Tạo course thành công",
      course: newCourse
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};



export const getCourseById = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await courseModel
      .findById(id)
      .populate("category_id", "cate_name")
      .populate("provider_id", "provider_name")
      .lean();

    if (!course) {
      return res.status(404).json({
        message: "Không tìm thấy khóa học",
      });
    }

    const [requests, overviews, sections] = await Promise.all([
      courseRequestModel.find({ course_id: id }).lean(),
      courseOverviewModel.find({ course_id: id }).lean(),
      courseSectionModel.find({ course_id: id }).lean()
    ]);

    // Lấy tất cả lectures 1 lần
    const lectures = await lectureModel.find({
      section_id: { $in: sections.map(s => s._id) }
    }).lean();

    // Gộp lectures vào section
    const sectionsWithLectures = sections.map(section => ({
      ...section,
      lectures: lectures.filter(l => l.section_id.toString() === section._id.toString())
    }));

    const resultCourse = {
      ...course,
      category: course.category_id?.cate_name,
      provider: course.provider_id?.provider_name,
      category_id: undefined,
      provider_id: undefined
    };

    return res.status(200).json({
      course: resultCourse,
      requests,
      overviews,
      sections: sectionsWithLectures
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};


export const getAllCourse = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;
    const filter = {isActive: true};

    if(search){
      const courses = await courseModel.find({
        name: { $regex: search.trim(), $options: "i" }
      }).select("_id");

      filter._id = { $in: courses.map((course) => course._id) };
    }

    const courses = await courseModel.find(filter)
      .populate({
        path: "category_id",
        select: "cate_name"
      })
      .populate({
        path: "provider_id",
        select: "provider_name"
      }).skip(skip).limit(Number(limit));

    const totalCourses = await courseModel.countDocuments(filter);

    const result = courses.map((c) => {
      return {
        _id: c._id,
        category: c.category_id?.cate_name,
        provider: c.provider_id?.provider_name,
        course_title: c.course_title,
        image_url: c.image_url,
        price: c.price,
        price_promotion: c.price_promotion,
        students: c.students,
        isActive: c.isActive,
        feature: c.feature
      };
    });

    res.status(200).json({
      message: "Lấy danh sách giáo viên thành công!",
      data: result,
      page: Number(page),
      limit: Number(limit),
      totalCourses
    });

  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
};