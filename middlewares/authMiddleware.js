const jwt = require("./../lib/jwt");
const SECRET = require("./../config/secret");

const authMiddleware = async (req, res, next) => {
    const token = req.cookies["auth"];

    if (!token) {
        return next();
    }

    try {
        const decoded = await jwt.verify(token, SECRET);

        req.user = decoded;

        res.locals.isAuthenticated = true;

        next();
    } catch (err) {
        next();
    }
}

const isAuth = (req, res, next) => {
    if (!req.user) {
        return res.redirect("/auth/login");
    }

    next();
}

const isGuest = (req, res, next) => {
    if (req.user) {
        return res.redirect("/");
    }

    next();
}

module.exports = {
    authMiddleware,
    isAuth,
    isGuest
}