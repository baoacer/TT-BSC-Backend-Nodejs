const { verifyToken } = require('../utils/jwt.utils');
const { ROLE } = require('../configs/contants')

const HEADER = {
    AUTHORIZATION: 'authorization'
}

const authenticateJWT = (req, res, next) => {
    const token = req.headers[HEADER.AUTHORIZATION];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const requireRole = (roleName) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (req.user.role === ROLE.ADMIN) {
            return next();
        }   
        if (req.user.role !== roleName) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};

module.exports = {
    requireRole,
    authenticateJWT,
};