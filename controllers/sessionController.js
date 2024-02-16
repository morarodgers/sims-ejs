const User = require("../models/User");
const parseVErr = require("../utils/parseValidationErrs");

const render_index = (req, res) => {
  if (req.user) {
    return res.redirect("/students");
  }
  res.render("pages/index", {
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

const render_sign_up = (req, res) => {
  res.render("pages/sign-up", {
    user_values: {},
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

const sign_up = async (req, res, next) => {
  let error_state = false;
  const user_doc = new User(req.body);
  const user_values = { name: req.body.name, email: req.body.email };
  try {
    await user_doc.validate();
  } catch (e) {
    error_state = true;
    if (e.name === "ValidationError") {
      parseVErr(e, req);
    } else {
      return next(e);
    }
  }
  if (req.body.password != req.body.password_confirm) {
    error_state = true;
    req.flash("error", "Passwords do not match.");
  }
  if (error_state === true) {
    return res.render("pages/sign-up", {
      user_values,
      errors: req.flash("error"),
      info: req.flash("info"),
    });
  }
  try {
    await User.create(req.body);
  } catch (e) {
    if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }
    return res.render("pages/sign-up", {
      user_values,
      errors: req.flash("error"),
      info: req.flash("info"),
    });
  }
  return res.redirect("/");
};

const log_off = (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

const login = (req, res) => {
  if (req.user) {
    return res.redirect("/students");
  }
  res.render("pages/logon", {
    errors: req.flash("error"),
    info: req.flash("info"),
  });
};

module.exports = {
  render_index,
  render_sign_up,
  sign_up,
  log_off,
  login,
};