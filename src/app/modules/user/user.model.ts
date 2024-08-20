import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    needPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
    },
    status: {
      type: String,
      enum: ["in-progress", "blocked"],
      default: "in-progress",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// pre save middleware/ hook : will work on create() save()
userSchema.pre("save", async function (next) {
  const user = this as any;
  // hashing password and save into DB
  user.password = await bcrypt.hash(
    user.password,
    Number(config.brcypt_salt_rounds)
  );
  next();
});

// post  save middleware / hook
userSchema.post("save", function (doc, next) {
  (doc.password = ""),
    // console.log(this, "post hook : We saved our data");
    next();
});

export const UserModel = model<TUser>("User", userSchema);
