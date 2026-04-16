import User from "../../models/User";
import type { MFilter, MUpdate } from "../../types/mongoose.type";
import { IUserDocument, RegisterDTO } from "./auth.types";

export class AuthRepository {
  /* ================= FIND BY EMAIL ================= */
  static findByEmail(email: string) {
    return User.findOne({ email }).exec();
  }

  /* ================= FIND BY ID ================= */
  static findById(id: string) {
    return User.findById(id).exec();
  }

  /* ================= CREATE USER ================= */
  static create(data: RegisterDTO) {
    return new User(data).save();
  }

  /* ================= UPDATE USER ================= */
  static updateById(id: string, update: MUpdate<IUserDocument>) {
    return User.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).exec();
  }

  /* ================= GENERIC FIND ONE ================= */
  static findOne(filter: MFilter<IUserDocument>) {
    return User.findOne(filter).exec();
  }

  /* ================= SAVE USER ================= */
  static save(user: IUserDocument) {
    return user.save();
  }
}