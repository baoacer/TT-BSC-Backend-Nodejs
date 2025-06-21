const RoleRepository = require('./repositories/role.repo');
const UserRepository = require('./repositories/user.repo');
const { NotFoundError, BadRequestError } = require('../core/error.response');

const createRole = async ({ name, description }) => {
    const existed = await RoleRepository.getRoleByName({ name });
    if (existed) throw new BadRequestError('Role already exists');
    return await RoleRepository.createRole({ name, description });
};

const assignRoleToUser = async ({ userID, roleName }) => {
    const role = await RoleRepository.getRoleByName({ name: roleName });
    if (!role) throw new NotFoundError('Role not found');
    const user = await UserRepository.findUserByID({ userID });
    if (!user) throw new NotFoundError('User not found');
    return await UserRepository.updateUserRole({ userID, roleID: role._id });
};

const getAllRoles = async () => {
    return await RoleRepository.getAllRoles();
};

module.exports = {
    createRole,
    assignRoleToUser,
    getAllRoles,
};