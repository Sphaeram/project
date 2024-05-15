const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sanitizeFields } = require("../utils/otherUtils");

module.exports = {
  signUp: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(["email", "username", "password"], req.body);
    sanitizedFields.is_email_verified = 1;

    if (!sanitizedFields.email || !sanitizedFields.username || !sanitizedFields.password)
      return res.status(400).json({ data: "Bad Request!" });

    try {
      if (sanitizedFields.username.length < 3)
        return res.status(403).json({ data: "Name Must be atleast 3 characters long!" });
      if (sanitizedFields.password.length < 6)
        return res.status(403).json({ data: "Password must be atleat 6 Characters Long!" });
      if (sanitizedFields.password === "Password" || sanitizedFields.password === "password")
        return res.status(403).json({ data: "Password must NOT be password!" });

      const user = await db.user.findOne({
        where: { email: sanitizedFields.email.toLowerCase() },
        raw: true,
      });

      if (user) return res.status(409).json({ data: "Email Already Registered!" });

      const createdUser = await db.user.create(sanitizedFields);

      return res.status(200).json({ data: createdUser });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  login: async (req, res, next) => {
    const { email, password } = req.body;
    if (!email) return res.status(400).json({ data: "Email is Required!" });
    if (!password) return res.status(400).json({ data: "Password is Required!" });

    if (password.length < 6)
      return res.json({ status: 403, data: "Password must be atleat 6 Characters Long!" });

    try {
      const user = await db.user.findOne({
        where: { email: email },
        raw: true,
      });
      if (!user) return res.status(404).json({ data: "Email Not Registered!" });

      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) return res.status(403).json({ data: "Invalid Credentials!" });

      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          user_type_id: user.user_type_id,
        },
        process.env.ACCESS_TOKEN_SECRET
        //   { expiresIn: "900s" }
      );

      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        user_type_id: user.user_type_id,
        accessToken: accessToken,
      };

      return res.status(200).json({ data: userData });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
