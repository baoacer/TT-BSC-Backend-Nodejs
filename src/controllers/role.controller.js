const RoleService = require("../services/role.service");
const { StatusCodes } = require("../utils/handler/http.status.code");

const createRole = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const role = await RoleService.createRole({ name, description });
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Role created", metadata: role });
  } catch (error) {
    next(error);
  }
};

const assignRoleToUser = async (req, res, next) => {
  try {
    const { userID, roleName } = req.body;
    const user = await RoleService.assignRoleToUser({ userID, roleName });
    res.status(StatusCodes.OK).json({ message: "Role assigned", metadata: user });
  } catch (error) {
    next(error);
  }
};

const getAllRoles = async (req, res, next) => {
  try {
    const roles = await RoleService.getAllRoles();
    res.status(StatusCodes.OK).json({ metadata: roles });
  } catch (error) {
    next(error);
  }
};

module.exports = { createRole, assignRoleToUser, getAllRoles };
