const router = require("express").Router();

const authService = require('./../services/authService');

const { isGuest, isAuth } = require("./../middlewares/authMiddleware");

const { getErrorMessage } = require("./../utils/errorUtils");

router.get("/register", isGuest, (req, res) => {
    res.render("auth/register");
});

router.get("/login", isGuest, (req, res) => {
    res.render("auth/login");
});

router.post("/register", isGuest, async (req, res) => {
    try {
        const token = await authService.registerUser(req.body);

        res.cookie("auth", token);
        res.redirect("/");
    } catch (err) {
        res.locals.error = getErrorMessage(err);
        res.render("auth/register", { registerData: req.body });
    }
});

router.post("/login", isGuest, async (req, res) => {
    try {
        const token = await authService.loginUser(req.body);

        res.cookie("auth", token);
        res.redirect("/");
    } catch (err) {
        res.locals.error = getErrorMessage(err);
        res.render("auth/login", { loginData: req.body });
    }
});

router.get("/logout", isAuth, (req, res) => {
    res.clearCookie("auth");
    res.redirect("/auth/login");
});

module.exports = router;