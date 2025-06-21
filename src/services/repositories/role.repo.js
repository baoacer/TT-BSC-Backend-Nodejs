const Role = require("../../models/role.model");

class RoleRepository {
  static async createRole({ name, description }) {
    return await Role.create({ name, description });
  }

  static async getRoleByName({ name }) {
    return await Role.findOne({ name }).lean();
  }

  static async getRoleById({ roleID }) {
    return await Role.findOne({ _id: roleID })
  }

  static async getAllRoles() {
    return await Role.find().lean();
  }
}

module.exports = RoleRepository;
