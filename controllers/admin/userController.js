const db = require("../../models/index");
const { Op } = require("sequelize");
const { sanitizeFields } = require("../../utils/otherUtils");

module.exports = {
  updateUserById: async (req, res) => {
    const { userId } = req.query;
    if (!userId || Object.keys(req.body).length === 0)
      return res.status(400).json({ data: "Bad Request!" });
    const sanitizedFields = sanitizeFields(
      ["email", "username", "phone_no"],
      req.body
    );

    try {
      const user = await db.user.findOne({
        where: { id: userId, user_type_id: { [Op.ne]: 6156 } },
      });
      if (!user) return res.status(404).json({ data: "User Not Found!" });

      await db.user.update(sanitizedFields, { where: { id: userId } });
      return res.status(200).json({ data: "User Updated Successfully!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
  getAllUsers: async (req, res, next) => {
    try {
      const users = await db.user.findAll({
        where: { user_type_id: { [Op.not]: 6156 } },
        include: { model: db.user_type, attributes: ["title"] },
      });
      return res.status(200).json({ data: users });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getUserById: async (req, res, next) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ data: "Bad Request!" });
    try {
      const user = await db.user.findByPk(userId, {
        include: { model: db.user_type, attributes: ["title"] },
      });
      if (!user) return res.status(404).json({ data: "User Not Found!" });
      return res.status(200).json({ data: user });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  deleteUserById: async (req, res, next) => {
    const { userId } = req.query;
    if (!userId || isNaN(userId))
      return res.status(400).json({ data: "Bad Request!" });
    try {
      const user = await db.user.findByPk(userId);
      if (!user) return res.status(404).json({ data: "User Not Found!" });
      if (user.user_type_id === 6156) return res.sendStatus(403);
      if (req.user.id === parseInt(userId) || req.user.user_type_id === 6156) {
        await db.user.destroy({ where: { id: user.id } });
        return res.status(200).json({ data: "User Deleted!" });
      } else return res.sendStatus(403);
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  deleteAllUsers: async (req, res) => {
    try {
      const users = await db.user.findAll();
      if (users.length === 0)
        return res.status(404).json({ data: "No Users Found!" });
      await db.user.destroy({ where: { user_type_id: { [Op.not]: 6156 } } });
      return res.status(200).json({ data: "All Users Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
