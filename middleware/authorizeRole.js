const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({
        message: "Bạn không có quyền thực hiện chức năng này!"
      });
    }
    next();
  };
  
};

export default authorizeRole;