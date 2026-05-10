import providerModel from "../models/provider.js";
import userModel from "../models/user.js";


export const createProvider = async (req, res) => {
  try {
    const user_id = req.user.userId; 
    const { provider_name, career, email  } = req.body;

    if (!provider_name || !email) {
      return res.status(400).json({ message: "Thiếu provider_name / email" });
    }

    // chặn gửi trùng (mỗi user chỉ 1 hồ sơ)
    const existed = await providerModel.findOne({ user_id });
    if (existed) {
      return res.status(400).json({ message: "Bạn đã gửi đăng ký trước đó!" });
    }

    const provider = await providerModel.create({
      user_id,
      provider_name,
      career,
      email,
      status: "pending",  
    });

 
    return res.status(201).json({
      message: "Gửi đăng ký thành công, vui lòng chờ admin duyệt",
      data: provider,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPendingProviders = async (req, res) => {
  try {
    const providers = await providerModel
      .find({ status: "pending" })
      .sort({ createdAt: -1 });

    res.json({
      providers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const approveProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    const provider = await providerModel.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Không tìm thấy đăng ký provider" });
    }

    provider.status = "approved";
    await provider.save();

    await userModel.findByIdAndUpdate(provider.user_id, { role: "provider" });

    return res.json({ message: "Duyệt provider thành công", provider });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};