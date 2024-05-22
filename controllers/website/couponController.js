const checkCoupon = require("../../utils/checkCoupon");

module.exports = {
  checkCouponByCode: async (req, res) => {
    const { id } = req.user;
    if (!req.body["code"] || !req.body["sub_total"]) return res.status(400).json("Bad Request!");
    try {
      const { code } = req.body;

      const checkedCoupon = await checkCoupon(id, code);

      if (checkedCoupon.hasOwnProperty("status") && checkedCoupon.hasOwnProperty("message"))
        return res.status(checkedCoupon.status).json({ message: checkedCoupon.message });

      return res.status(200).json(checkedCoupon);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};
