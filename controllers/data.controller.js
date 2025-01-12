import Disaster from "../models/data.models.js";
import cloudinary from "../configs/cloudinary.config.js";
import moment from "moment-timezone";

moment.locale("id");

export const createDisaster = async (req, res) => {
  try {
    const { name, type, location, description, date } = req.body;
    const status = req.body.status?.trim() || "active";

    // Validation
    if (!name || !type || !location || !description || !date) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required" });
    }

    // Mengonversi tanggal ke zona waktu Jakarta (UTC+7)
    const jakartaDate = moment.tz(date, "Asia/Jakarta");

    // Format dengan hari dalam bahasa Indonesia, tanggal, nama bulan, tahun, dan waktu dalam format 24 jam
    // Jika tanggal tidak ada, gunakan waktu saat ini
    const disasterDate = date
      ? moment.tz(date, "Asia/Jakarta")
      : moment.tz("Asia/Jakarta");

    const formattedDate = disasterDate.format("dddd, DD MMMM YYYY, HH:mm:ss"); // Format 24 jam

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(
      req.files.map(async (file) => {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "project_uas/disasters",
          public_id: file.originalname.split(".")[0],
          resource_type: "image",
          overwrite: true,
        });

        return {
          url: uploaded.secure_url,
          originalName: file.originalname,
          publicId: uploaded.public_id,
        };
      })
    );

    const disaster = new Disaster({
      name,
      type,
      location,
      description,
      date: jakartaDate.toDate(),
      images: imageUrls,
      status,
      formattedDate: formattedDate,
    });

    await disaster.save();

    res
      .status(201)
      .json({ success: true, message: "Disaster created successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getAllDisasters = async (req, res) => {
  try {
    const disasters = await Disaster.find();

    const formattedDisasters = disasters.map((disaster) => {
      const formattedDateWIB = moment
        .utc(disaster.date)
        .tz("Asia/Jakarta")
        .format("dddd, DD MMMM YYYY, HH:mm [WIB]"); // Format 24 jam
      const formattedDateWITA = moment
        .utc(disaster.date)
        .tz("Asia/Makassar")
        .format("dddd, DD MMMM YYYY, HH:mm [WITA]"); // Format 24 jam
      const formattedDateWIT = moment
        .utc(disaster.date)
        .tz("Asia/Jayapura")
        .format("dddd, DD MMMM YYYY, HH:mm [WIT]"); // Format 24 jam

      return {
        ...disaster._doc,
        formattedDateWIB,
        formattedDateWITA,
        formattedDateWIT,
      };
    });

    res.status(200).json({ success: true, data: formattedDisasters });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDisasterById = async (req, res) => {
  try {
    const disaster = await Disaster.findById(req.params.id);
    if (!disaster) {
      return res
        .status(404)
        .json({ success: false, error: "Disaster not found" });
    }
    res.status(200).json({ success: true, data: disaster });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.findById(req.params.id);
    if (!disaster) {
      return res
        .status(404)
        .json({ success: false, error: "Disaster not found" });
    }

    const { name, type, location, description, date } = req.body;

    if (name) disaster.name = name;
    if (type) disaster.type = type;
    if (location) disaster.location = location;
    if (description) disaster.description = description;
    if (date) disaster.date = date;

    if (req.files && req.files.length > 0) {
      const imageUrls = await Promise.all(
        req.files.map(async (file) => {
          const uploaded = await cloudinary.uploader.upload(file.path, {
            folder: "uploads/disasters",
            public_id: file.originalname.split(".")[0],
            resource_type: "image",
            overwrite: true,
          });

          return {
            url: uploaded.secure_url,
            originalName: file.originalname,
            publicId: uploaded.public_id,
          };
        })
      );

      if (imageUrls.length > 0) disaster.images = imageUrls;
    }

    await disaster.save();

    res.status(200).json({
      success: true,
      message: "Disaster updated successfully",
      data: disaster,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.findByIdAndDelete(req.params.id);
    if (!disaster) {
      return res
        .status(404)
        .json({ success: false, error: "Disaster not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Disaster deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
