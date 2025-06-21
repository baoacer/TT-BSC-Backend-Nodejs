"use strict";
const USER = require("../../models/user.model");

class UserRepository {
  static async updateUserRole({ userID, roleID }) {
    return await USER.findByIdAndUpdate(
      userID,
      { role: roleID },
      { new: true }
    ).lean();
  }

  static async createUser({ email, password, role }) {
    return await USER.create({
      email,
      password,
      role,
    });
  }

  static async findUserByEmail({ email }) {
    let user = await USER.findOne({
      email: email,
    }).populate("role", "name").lean();
    return user;
  }

  static async findUserByID({ userID }) {
    return await USER.findOne({
      _id: userID,
    }).lean();
  }

  static async activeUser({ userID, isActive }) {
    return await USER.findByIdAndUpdate(
      userID,
      { isActive: isActive },
      { new: true }
    ).lean();
  }

  static async updateUser({ userID, update }) {
    return await USER.findByIdAndUpdate(userID, update, { new: true }).lean();
  }

  static async getAll({
    page,
    limit,
    status,
    search,
    sort = { createdAt: -1 },
  }) {
    const skip = (page - 1) * limit;
    const filter = {};

    if (status) filter.isActive = status;

    if (search) {
      filter.$or = [
        {
          email: { $regex: search, $options: "i" },
        },
        {
          phone: { $regex: search, $options: "i" },
        },
      ];
    } 
    const [users, total] = await Promise.all([
      USER.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate({ path: "role", select: "name" })
        .lean(),
      USER.countDocuments(filter),
    ]);
    return {
      users,
      pagination: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit),
      },
    };
  }
}

module.exports = UserRepository;
