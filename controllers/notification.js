




export const getAdminNotifications = async (req, res) => {
  const list = await notificationModel
    .find({})
    .sort({ createdAt: -1 })
    .limit(20);

  return res.json({ data: list });
};

export const markNotificationRead = async (req, res) => {
  const { id } = req.params;
  const noti = await notificationModel.findByIdAndUpdate(
    id,
    { is_read: true },
    { new: true }
  );

  return res.json({ data: noti });
};