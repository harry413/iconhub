
import mongoose from "mongoose";

const iconSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  tags: [String],
  svg: { type: String, required: true },
  png: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  downloads: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const Icon = mongoose.model('Icon', iconSchema);
export default Icon;