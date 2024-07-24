const db = require("../../models");
const { sanitizeFields } = require("../../utils/otherUtils");

const updateUser = async (req, res) => {
  const { id } = req.user;
  if (!id) return res.status(400).json({ data: "Bad Request!" });
  const sanitizedFields = sanitizeFields(
    ["email", "username", "phone_no"],
    req.body
  );

  try {
    const user = await db.user.findByPk(id);
    if (!user) return res.status(404).json({ data: "User Not Found!" });

    await db.user.update(sanitizedFields, { where: { id: id } });
    return res.status(200).json({ data: "User Updated Successfully!" });
  } catch (error) {
    return res.status(500).json({ data: error.message });
  }
};

module.exports = { updateUser };
