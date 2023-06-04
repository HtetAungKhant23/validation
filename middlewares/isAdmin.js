const User = require('../models/user');

const isAdmin = async (req, res, next) => {
    const user = await User.findById(req.userAuth);
    if (user.isAdmin) {
        next();
    } else {
        const err = new Error('Access Denied, Admin only!');
        next(err);
    }
}

module.exports = isAdmin;