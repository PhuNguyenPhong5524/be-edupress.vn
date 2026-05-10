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
      category_id: course.category_id?._id,
      category_name: course.category_id?.cate_name,
      provider_id: course.provider_id?._id,
      provider_name: course.provider_id?.provider_name
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

    const filter = {
      isActive: true,
    };

    if (search) {
      filter.course_title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const [courses, totalCourses] = await Promise.all([
      courseModel
        .find(filter)
        .populate("category_id", "cate_name")
        .populate("provider_id", "provider_name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),

      courseModel.countDocuments(filter),
    ]);

    const result = courses.map(c => ({
      _id: c._id,
      category: c.category_id?.cate_name || "",
      provider: c.provider_id?.provider_name || "",
      course_title: c.course_title,
      image_url: c.image_url,
      price: c.price,
      price_promotion: c.price_promotion,
      students: c.students,
      isActive: c.isActive,
      feature: c.feature,
    }));

    res.status(200).json({
      data: result,
      page: Number(page),
      limit: Number(limit),
      totalCourses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getFeaturedCourses = async (req, res) => {
  try {
    const courses = await courseModel
      .find({
        isActive: true,
        feature: true,
      })
      .populate({
        path: "category_id",
        select: "cate_name",
      })
      .populate({
        path: "provider_id",
        select: "provider_name",
      })
      .sort({ createdAt: -1 });

    const result = courses.map((c) => ({
      _id: c._id,
      category: c.category_id?.cate_name,
      provider: c.provider_id?.provider_name,
      course_title: c.course_title,
      image_url: c.image_url,
      price: c.price,
      price_promotion: c.price_promotion,
      students: c.students,
      feature: c.feature,
    }));

    return res.status(200).json({
      message: "Lấy danh sách khóa học nổi bật thành công!",
      total: result.length,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllCourseOfProvider = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;
    const userId = req.user.userId; // ✅ từ authMiddleware

    // Tìm provider theo user đang login
    const provider = await providerModel.findOne({
      user_id: userId,
      status: "approved",
    });

    if (!provider) {
      return res.status(403).json({
        message: "Bạn không có quyền xem khóa học",
      });
    }

    // Filter CHỈ course của provider đó
    const filter = {
      isActive: true,
      provider_id: provider._id,
    };

    // Search theo tên khóa học
    if (search) {
      filter.course_title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // Query
    const courses = await courseModel
      .find(filter)
      .populate("category_id", "cate_name")
      .populate("provider_id", "provider_name")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const totalCourses = await courseModel.countDocuments(filter);

    const result = courses.map((c) => ({
      _id: c._id,
      category_id: c.category_id?._id,
      category: c.category_id?.cate_name,
      provider_id: c.provider_id?._id,
      provider: c.provider_id?.provider_name,
      course_title: c.course_title,
      image_url: c.image_url,
      price: c.price,
      price_promotion: c.price_promotion,
      students: c.students,
      isActive: c.isActive,
      feature: c.feature,
    }));

    return res.status(200).json({
      message: "Lấy danh sách khóa học thành công!",
      data: result,
      page: Number(page),
      limit: Number(limit),
      totalCourses,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Tìm provider theo user đang đăng nhập
    const provider = await providerModel.findOne({
      user_id: userId,
      status: "approved",
    });

    if (!provider) {
      return res.status(403).json({
        message: "Bạn không có quyền xóa khóa học này!",
      });
    }

    // Kiểm tra course tồn tại + thuộc provider đó
    const course = await courseModel.findOne({
      _id: id,
      provider_id: provider._id,
    });

    if (!course) {
      return res.status(404).json({
        message: "Không tìm thấy khóa học hoặc bạn không có quyền!",
      });
    }

    // Lấy tất cả section của course
    const sections = await courseSectionModel
      .find({ course_id: id })
      .select("_id");

    const sectionIds = sections.map((s) => s._id);

    // Xóa lectures
    if (sectionIds.length > 0) {
      await lectureModel.deleteMany({
        section_id: { $in: sectionIds },
      });
    }

    // Xóa sections
    await courseSectionModel.deleteMany({
      course_id: id,
    });

    // Xóa overview
    await courseOverviewModel.deleteMany({
      course_id: id,
    });

    // Xóa request
    await courseRequestModel.deleteMany({
      course_id: id,
    });

    // Xóa course chính
    await courseModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Xóa khóa học và toàn bộ dữ liệu liên quan thành công!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};


export const UpdateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      category_id,
      course_title,
      price,
      image_url,
      video_url,
      description,
      duration,
      feature,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Thiếu id khóa học",
      });
    }

    if (!category_id || !course_title || price === undefined) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    // lấy userId từ token
    const userId = req.user.userId;

    // tìm provider theo user
    const provider = await providerModel.findOne({
      user_id: userId,
      status: "approved",
    });

    if (!provider) {
      return res.status(403).json({
        message: "Tài khoản chưa được duyệt làm nhà cung cấp!",
      });
    }

    // kiểm tra course tồn tại & thuộc provider này
    const course = await courseModel.findOne({
      _id: id,
      provider_id: provider._id,
    });

    if (!course) {
      return res.status(404).json({
        message: "Không tìm thấy khóa học hoặc không có quyền chỉnh sửa",
      });
    }

    // cập nhật
    course.category_id = category_id;
    course.course_title = course_title;
    course.price = price;
    course.image_url = image_url;
    course.video_url = video_url || "";
    course.description = description;
    course.duration = duration;
    course.feature = feature ?? course.feature;

    await course.save();

    return res.status(200).json({
      message: "Cập nhật khóa học thành công",
      course,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
``