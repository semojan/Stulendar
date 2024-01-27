const express = require("express");

const router = express.Router();

const sessionUtil = require("../util/session-util");
const validation = require("../util/validations");
const User = require("../model/user.model");

router.get("/signup", function (req, res, next) {
  let sessionData = sessionUtil.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      username: "",
      email: "",
    };
  }

  res.render("signup", (inputData = sessionData));
});

router.post("/signup", async function (req, res, next) {
  const userData = req.body;

  if (
    !validation.userDetailsAreValid(
      userData.username,
      userData.password,
      userData.email
    ) ||
    !validation.repeatPassMatch(userData.password, userData.repeatPass)
  ) {
    sessionUtil.flashDataToSession(
      req,
      {
        errorMessage:
          "اطلاعات نامعتبر. رمز عبور باید حداقل 5 کارکتر داشته باشد و نام کاربری نباید خالی باشند.",
        username: userData.username,
        email: userData.email,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(userData.username, userData.password, userData.email);

  let createdUser;

  try {
    const existsAlready = await user.getUser();

    if (existsAlready) {
      sessionUtil.flashDataToSession(
        req,
        {
          errorMessage:
            "نام کاربری تکراری. اگر از قبل ثبت نام کردید وارد شوید در غیر این صورت نام کاربری دیگری انتخاب کنید.",
          username: userData.username,
          email: userData.email,
        },
        function () {
          res.redirect("/signup");
        }
      );
      return;
    }

    await user.addUser();

    createdUser = await user.getUser();
  } catch (error) {
    next(error);
    return;
  }

  sessionUtil.createUserSession(req, createdUser, function () {
    res.redirect("/");
  });
});

router.get("/login", function (req, res, next) {
  let sessionData = sessionUtil.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      username: "",
    };
  }

  res.render("login", (inputData = sessionData));
});

router.post("/login", async function (req, res, next) {
  const userData = req.body;
  const user = new User(userData.username, userData.password);

  let existingUser;

  try {
    existingUser = await user.getUser();
  } catch (error) {
    next(error);
    return;
  }

  if (!existingUser) {
    sessionUtil.flashDataToSession(
      req,
      {
        errorMessage: "نام کاربری اشتباه است.",
        username: userData.username,
      },
      function () {
        res.redirect("/login");
      }
    );
    return;
  }

  const correctPass = await user.comparePass(existingUser.password);

  if (!correctPass) {
    sessionUtil.flashDataToSession(
      req,
      {
        errorMessage: "رمز عبور اشتباه است.",
        username: userData.username,
      },
      function () {
        res.redirect("/login");
      }
    );
    return;
  }

  sessionUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
});

router.get("/logout", function (res, req, next) {
  console.log(req.session.uid)
  sessionUtil.destroyUserAuthSession(req);
  console.log(req.session.uid)
  res.redirect("/");
});

module.exports = router;
