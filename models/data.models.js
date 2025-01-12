import mongoose from "mongoose";

const disasterSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nama bencana
  type: { type: String, required: true }, // Jenis bencana (gunung api, gempa bumi, dll.)
  location: { type: String, required: true }, // Lokasi bencana
  description: { type: String, required: true }, // Deskripsi singkat
  date: { type: Date, required: true }, // Tanggal terjadinya bencana
  images: [
    {
      url: { type: String, required: true }, // URL gambar
      originalName: { type: String, required: true }, // Nama asli file
      publicId: { type: String, required: true }, // ID dari Cloudinary
    },
  ],
});

export default mongoose.model("Disaster", disasterSchema);
