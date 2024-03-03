const router = require('express').Router();

const stonesService = require("./../services/stonesService");

router.get("/", async (req, res) => {
    const stones = await stonesService.getLastStones().lean();
    res.render("home", { stones });
});

module.exports = router;