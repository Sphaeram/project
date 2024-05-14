const db = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const login = async (req, res, next) => {
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
};

module.exports = { login };
