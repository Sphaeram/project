const db = require("../../models");

module.exports = {
  assignPackageToCar: async (req, res, next) => {
    const carId = req.query.carId;
    const packageId = req.query.packageId;
    if (!carId || !packageId) return res.status(400).json({ data: "Bad Request!" });

    try {
      const car = await db.car.findByPk(carId);
      if (!car) return res.status(400).json({ data: "No Such Car Found!" });
      const package = await db.package.findByPk(packageId);
      if (!package) return res.status(400).json({ data: "No Such Package Found!" });

      await db.car_package.create({
        car_id: carId,
        package_id: packageId,
      });

      return res.status(200).json({ data: "Package Assigned Successfully!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  removePackageFromCar: async (req, res, next) => {
    const carId = req.query.carId;
    const packageId = req.query.packageId;
    if (!carId || !packageId) return res.status(400).json({ data: "Bad Request!" });

    try {
      const car = await db.car.findByPk(carId);
      if (!car) return res.status(400).json({ data: "No Such Car Found!" });
      const package = await db.package.findByPk(packageId);
      if (!package) return res.status(400).json({ data: "No Such Package Found!" });

      await db.car_package.destroy({
        where: { car_id: carId, package_id: packageId },
        force: true,
      });

      return res.status(200).json({ data: "Package Removed Successfully!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
