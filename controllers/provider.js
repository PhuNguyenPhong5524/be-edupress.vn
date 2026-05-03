import providerModel from "../models/provider.js";

export const createProvider = async (req, res) => {
  try {
    const { user_id, provider_name, career, email, images, status } = req.body;

    if (!user_id || !provider_name || !email) {
      return res.status(400).json({
        message: "Thiếu user_id / provider_name / email"
      });
    }

    const provider = await providerModel.create({
      user_id,
      provider_name,
      career,
      email,
      images,
      status
    });

    res.status(201).json({
      message: "Tạo provider thành công",
      data: provider
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

