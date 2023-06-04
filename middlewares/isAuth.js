const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");

const isAuth = (req, res, next) => {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);
    if(!decoded){
        const err = new Error('Invalid/expired token, please login again!');
        next(err);
    }else{
        req.userAuth = decoded.id;
        next();
    }
}

module.exports = isAuth;