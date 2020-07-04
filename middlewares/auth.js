exports.adminAccess = async (req, res, next) => {
  if (req.user && req.user.userType == 'admin') {
    next()
  } else {
    res.json('Access denied')
  }
}