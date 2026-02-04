import { Schema, model, models } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string; // Will store hashed password later
  role: "renter" | "landlord";
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["renter", "landlord"], default: "renter" },
  },
  { timestamps: true },
);

// Prevent model overwrite upon hot-reload
const User = models.User || model<IUser>("User", UserSchema);
export default User;
