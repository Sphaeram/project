const db = require("../../models/index");

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      const users = await db.user.findAll();
      return res.status(200).json({ data: users });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getUserById: async (req, res, next) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const user = await db.user.findByPk(userId);
      if (!user) return res.status(404).json({ data: "User Not Found!" });
      return res.status(200).json({ data: user });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  deleteUserById: async (req, res, next) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const user = await db.user.findByPk(userId);
      if (!user) return res.status(404).json({ data: "User Not Found!" });

      await db.user.destroy({ where: { id: user.id } });
      return res.status(200).json({ data: "User Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
