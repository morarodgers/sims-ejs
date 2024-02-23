const express = require("express");
const passport = require("passport");
const router = express.Router();

const { refreshCSRF } = require("../middleware/auth");

const {
  render_index,
  render_sign_up,
  sign_up,
  log_off,
  login,
  render_welcome,
} = require("../controllers/sessionController");

router.route("/").get(render_index);
router.route("/sign-up").get(render_sign_up).post(sign_up);
router
  .route("/logon")
  .get(login)
  .post(
    passport.authenticate("local", {
      successRedirect: "/welcome",
      failureRedirect: "/logon",
      failureFlash: true,
    }),
    refreshCSRF
  );
router.route("/logoff").get(log_off);
router.route("/welcome").get(render_welcome);

module.exports = router;