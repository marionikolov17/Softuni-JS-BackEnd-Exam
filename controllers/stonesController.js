const router = require("express").Router();

const stonesService = require("../services/stonesService");

const { isAuth } = require("../middlewares/authMiddleware");

const { getErrorMessage } = require("./../utils/errorUtils");

router.get("/", async (req, res) => {
  const stones = await stonesService.getAllStones().lean();

  res.render("stones/dashboard", { stones });
});

router.get("/create", isAuth, (req, res) => {
  res.render("stones/create");
});

router.get("/search", async (req, res) => {
  const stones = await stonesService.searchStones(req.query.name);
  res.render("stones/search", { stones });
});

router.get("/:id", async (req, res) => {
  try {
    const stone = await stonesService
      .getStone(req.params.id)
      .populate("likedList")
      .lean();

    const isAuth = req.user !== undefined;
    const isOwner = req?.user?._id == stone.owner;
    const hasLiked = stone.likedList.some((user) => user._id == req?.user._id);

    res.render("stones/details", {
      stone,
      isAuth,
      isOwner,
      hasLiked,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/404");
  }
});

router.get("/:id/edit", isAuth, async (req, res) => {
  try {
    const stone = await stonesService.getStone(req.params.id).lean();

    if (stone.owner != req.user._id)
      return res.redirect(`/stones/${req.params.id}`);

    res.render("stones/edit", { stone });
  } catch {
    res.redirect("/404");
  }
});

router.get("/:id/delete", isAuth, async (req, res) => {
  try {
    const stone = await stonesService.getStone(req.params.id).lean();

    if (stone.owner != req.user._id)
      return res.redirect(`/stones/${req.params.id}`);

    await stonesService.deleteStone(req.params.id);

    res.redirect("/stones");
  } catch {
    res.redirect("/404");
  }
});

router.get("/:id/like", isAuth, async (req, res) => {
  try {
    await stonesService.likeStone(req.user._id, req.params.id);

    res.redirect(`/stones/${req.params.id}`);
  } catch {
    res.redirect(`/stones/${req.params.id}`);
  }
});

router.post("/create", isAuth, async (req, res) => {
  try {
    await stonesService.createStone({ ...req.body, owner: req.user._id });

    res.redirect("/stones");
  } catch (err) {
    res.locals.error = getErrorMessage(err);
    res.render("stones/create", { stone: req.body });
  }
});

router.post("/:id/edit", isAuth, async (req, res) => {
  const stone = await stonesService.getStone(req.params.id);

  if (stone.owner != req.user._id)
    return res.redirect(`/stones/${req.params.id}`);

  try {
    await stonesService.updateStone(req.params.id, req.body);

    res.redirect(`/stones/${req.params.id}`);
  } catch (err) {
    res.locals.error = getErrorMessage(err);
    res.render("stones/edit", { stone: req.body });
  }
});

module.exports = router;
