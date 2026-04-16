import mongoose, { Schema, Document } from "mongoose";

export interface ITokenVersion extends Document {
  userId: string;
  version: number;
}

const tokenVersionSchema = new Schema<ITokenVersion>(
  {
    userId: { type: String, required: true, unique: true },
    version: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<ITokenVersion>(
  "TokenVersion",
  tokenVersionSchema
);