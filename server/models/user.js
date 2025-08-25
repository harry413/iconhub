import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: false },
  isAdmin: { type: Boolean, default: false },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true }, // only for Google users
  avatar: { type: String },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Icon" }],
  createdAt: { type: Date, default: Date.now },
});
// Handle missing password (Google users)
userSchema.methods.hasPassword = function () {
  return !!this.password;
};

const User = mongoose.model("User", userSchema);
export default User;