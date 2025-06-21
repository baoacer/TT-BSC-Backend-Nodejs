const bycrypt = require("bcrypt");
const Utils = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  FobiddenError,
  ConflictRequestError,
} = require("../core/error.response");
const UserRepository = require("./repositories/user.repo");
const { signToken } = require("../utils/jwt.utils");
const RoleReposisory = require("./repositories/role.repo");
const { sendEmailToken } = require("./email.service");

const signUp = async ({ email }) => {
  try {
    const user = await UserRepository.findUserByEmail({ email });
    if (user) throw new ConflictRequestError("Email already exists");

    const passwordHash = await bycrypt.hash(email, 10);

    const role = RoleReposisory.getRoleByName({ name: "User" });
    if (!role) throw new FobiddenError("Role not found");

    await UserRepository.createUser({
      email: email,
      password: passwordHash,
      role: role._id,
    });

    await sendEmailToken({ email: email })
  } catch (error) {
    throw new Error(error);
  }
};

const login = async ({ email = null, password = null }) => {
  try {
    // 1. check email
    const user = await UserRepository.findUserByEmail({ email });
    if (!user) throw new AuthFailureError("User not register");

    // 2. check password
    const isMatch = bycrypt.compare(password, user.password);
    if (!isMatch) throw new AuthFailureError("Password is incorrect");

    // 3. tạo JWT
    const payload = {
      userID: user._id,
      email: user.email,
      role: user.role,
    };
    const accessToken = signToken(payload);

    return {
      user: Utils.unGetGetData(user, ["password"]),
      accessToken,
    };
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  signUp,
  login,
};
