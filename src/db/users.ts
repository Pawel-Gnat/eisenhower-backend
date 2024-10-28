import { Schema, model } from "mongoose";

import { User as UserType } from "../types";

const UserSchema = new Schema<UserType>(
  {
    email: { type: String, unique: true, required: true, trim: true },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  { timestamps: true }
);

export const User = model<UserType>("User", UserSchema);

export const getUserByEmail = (email: string) => User.findOne({ email });
export const createUser = (values: Record<string, any>) =>
  new User(values).save();
