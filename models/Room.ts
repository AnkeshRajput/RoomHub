import mongoose, { Schema, model, models } from "mongoose";

export interface IRoom {
  title: string;
  description?: string;
  rent: number;
  address?: string;
  contactNumber?: string;
  location?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
  images?: { url: string; public_id?: string }[];
  owner: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    title: { type: String, required: true },
    description: { type: String },
    rent: { type: Number, required: true },
    address: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
        validate: {
          validator: function (v: Array<number>) {
            // allow undefined/null (optional), or an array of two numbers [lng, lat]
            return (
              v === undefined ||
              v === null ||
              (Array.isArray(v) &&
                v.length === 2 &&
                typeof v[0] === "number" &&
                typeof v[1] === "number")
            );
          },
          message: "Coordinates must be an array of two numbers [lng, lat]",
        },
      },
    },
    images: [{ url: String, public_id: String }],
    contactNumber: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

// Add geospatial index for radius queries
RoomSchema.index({ location: "2dsphere" });

const Room = models.Room || model<IRoom>("Room", RoomSchema);
export default Room;
