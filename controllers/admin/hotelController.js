const db = require("../../models/index");
const { sanitizeFields, deleteLocalFile } = require("../../utils/otherUtils");
const path = require("path");

const allowedFields = ["car_id", "title", "description", "location"];

module.exports = {
  createHotel: async (req, res, next) => {
    const sanitizedFields = sanitizeFields(allowedFields, req.body);

    if (req.files && req.files["hotel_image"] && req.files["hotel_image"].length > 0) {
      sanitizedFields.image = `${req.files["hotel_image"][0].destination.substring(7)}/${
        req.files["hotel_image"][0].filename
      }`;
    }
    try {
      const hotel = await db.hotel.create(sanitizedFields);
      return res.status(200).json({ data: hotel });
    } catch (error) {
      //* Deleting the new image
      if (req.files && req.files["hotel_image"] && req.files["hotel_image"]?.length !== 0)
        deleteLocalFile(path.join(__dirname, `../../public/${sanitizedFields.image}`));

      return res.status(500).json({ data: error.message });
    }
  },

  updateHotelById: async (req, res, next) => {
    let image = false;
    const { hotelId } = req.query;

    const sanitizedFields = sanitizeFields(allowedFields, req.body);

    if (req.files && req.files["hotel_image"] && req.files["hotel_image"].length > 0) {
      image = true;
      sanitizedFields.image = `${req.files["hotel_image"][0].destination.substring(7)}/${
        req.files["hotel_image"][0].filename
      }`;
    }

    try {
      if (!hotelId) throw new Error("Bad Request!");

      const hotel = await db.hotel.findByPk(hotelId);
      if (!hotel) throw new Error("No such hotel found!");

      const [rowsAffected] = await db.hotel.update(sanitizedFields, { where: { id: hotelId } });
      if (rowsAffected === 0) return res.status(500).json({ data: "Hotel Not Updated!" });

      if (image) deleteLocalFile(path.join(__dirname, `../../public/${hotel.image}`));

      return res.status(200).json({ data: "Hotel Updated!" });
    } catch (error) {
      //* Deleting the new image
      if (req.files && req.files["hotel_image"] && req.files["hotel_image"]?.length !== 0)
        deleteLocalFile(path.join(__dirname, `../../public/${sanitizedFields.image}`));

      return res.status(500).json({ data: error.message });
    }
  },

  getAllHotels: async (req, res, next) => {
    try {
      const hotels = await db.hotel.findAll();
      if (!hotels || hotels.length === 0) return res.status(404).json({ data: "No hotels found!" });

      return res.status(200).json({ data: hotels });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  getHotelById: async (req, res, next) => {
    const { hotelId } = req.query;
    if (!hotelId) return res.status(400).json({ data: "Bad Request" });

    try {
      const hotel = await db.hotel.findByPk(hotelId);
      if (!hotel) return res.status(404).json({ data: "Hotel Not Found" });

      return res.status(200).json({ data: hotel });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },

  deleteHotelById: async (req, res, next) => {
    const { hotelId } = req.query;
    if (!hotelId) return res.status(400).json({ data: "Bad Request" });

    try {
      const hotel = await db.hotel.findByPk(hotelId);
      if (!hotel) return res.status(404).json({ data: "Hotel Not Found" });
      await db.hotel.destroy({ where: { id: hotelId } });
      return res.status(200).json({ data: "Hotel Deleted!" });
    } catch (error) {
      return res.status(500).json({ data: error.message });
    }
  },
};
