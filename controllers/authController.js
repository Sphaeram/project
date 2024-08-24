const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sanitizeFields } = require("../utils/otherUtils");
const {
  ACCESS_TOKEN_SECRET,
  MAIL_SENDING_EMAIL,
} = require("../utils/constants");
const { transporter } = require("../utils/email");

module.exports = {
  signUp: async (req, res, next) => {
    const { type } = req.query;
    const sanitizedFields = sanitizeFields(
      ["email", "username", "password", "phone_no"],
      req.body
    );

    if (
      !sanitizedFields.email ||
      !sanitizedFields.username ||
      !sanitizedFields.password ||
      !sanitizedFields.phone_no
    )
      return res.status(400).json({ data: "Bad Request!" });

    try {
      if (sanitizedFields.username.length < 3)
        return res
          .status(403)
          .json({ data: "Name Must be atleast 3 characters long!" });
      if (sanitizedFields.password.length < 6)
        return res
          .status(403)
          .json({ data: "Password must be atleat 6 Characters Long!" });
      if (
        sanitizedFields.password === "Password" ||
        sanitizedFields.password === "password"
      )
        return res.status(403).json({ data: "Password must NOT be password!" });

      sanitizedFields.email = sanitizedFields.email.toLowerCase();
      const user = await db.user.findOne({
        where: { email: sanitizedFields.email },
        raw: true,
      });

      if (user)
        return res.status(409).json({ data: "Email Already Registered!" });

      const salt = bcrypt.genSaltSync(10);
      sanitizedFields.password = bcrypt.hashSync(
        sanitizedFields.password,
        salt
      );
      if (type === "agency") sanitizedFields.user_type_id = 7180;

      const createdUser = await db.user.create(sanitizedFields);

      return res.status(200).json({ data: createdUser });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  login: async (req, res, next) => {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ data: "Email is Required!" });
    if (!password)
      return res.status(400).json({ data: "Password is Required!" });

    if (password.length < 6)
      return res.json({
        status: 403,
        data: "Password must be atleat 6 Characters Long!",
      });

    try {
      const user = await db.user.findOne({
        where: { email: email?.toLowerCase() },
        raw: true,
      });
      if (!user) return res.status(404).json({ data: "Email Not Registered!" });

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect)
        return res.status(403).json({ data: "Invalid Credentials!" });

      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
          user_type_id: user.user_type_id,
        },
        ACCESS_TOKEN_SECRET
      );

      const userData = {
        id: user.id,
        email: user.email,
        username: user.username,
        user_type_id: user.user_type_id,
        accessToken: accessToken,
      };

      return res.status(200).json({ data: userData });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  changePassword: async (req, res) => {
    const { id } = req.user;
    const { oldPassword, newPassword } = req.body;
    if (!id || !oldPassword || !newPassword || newPassword.length < 6)
      return res.status(400).json({ data: "Bad Request!" });

    try {
      const user = await db.user.findByPk(id);
      if (!user) return res.status(404).json({ data: "User Not Found!" });

      const isOldPasswordCorrect = await bcrypt.compare(
        oldPassword,
        user.password
      );
      if (!isOldPasswordCorrect)
        return res.status(403).json({ data: "Invalid Old Password!" });

      const salt = bcrypt.genSaltSync(10);
      const hashedNewPassword = bcrypt.hashSync(newPassword, salt);

      await db.user.update(
        { password: hashedNewPassword },
        { where: { id: id } }
      );

      return res.status(200).json({ data: "Password Changed Successfully!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  resetPassword: async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ data: "Email is Required!" });

    try {
      const user = await db.user.findOne({
        where: { email: email?.toLowerCase() },
        raw: true,
      });
      if (!user) return res.status(404).json({ data: "Email Not Registered!" });

      const password = Math.random().toString(36).substring(2, 10);
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      await db.user.update(
        { password: hashedPassword },
        { where: { id: user.id } }
      );

      // Send email with new password
      let options = {
        from: MAIL_SENDING_EMAIL,
        to: user.email,
        subject: "Reset Password",
        html: `Here is your new password:\n${password}`,
      };

      transporter.sendMail(options, (error, info) => {
        if (error) {
          console.log("Error in Sending Email for resetting password!");
        } else {
          console.log("Reset Password Email sent!");
        }
      });

      return res.status(200).json("Password Reset!");
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
