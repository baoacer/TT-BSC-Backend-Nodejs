const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Utils = require("../utils");
const User = require("../models/user.model");
const {
  BadRequestError,
  AuthFailureError,
  FobiddenError,
  ConflictRequestError,
  NotFoundError,
} = require("../core/error.response");
const UserRepository = require("./repositories/user.repo");
const { signToken } = require("../utils/jwt.utils");
const RoleRepository = require("./repositories/role.repo");
const { sendEmailToken, sendEmailResetPassword } = require("./email.service");
const OtpService = require("./otp.service");

const reset = async ({ email }) => {
  const user = await UserRepository.findUserByEmail({ email });
  if (!user) throw new BadRequestError("Email Not Register");

  const newPassword = crypto.randomBytes(3).toString("hex");
  const passwordHash = await bcrypt.hash(newPassword, 10);

  user.password = passwordHash;
  await user.save();

  /**
   * 1. Send Verify Email Token
   */
  await sendEmailResetPassword({ email: email, password: newPassword }).catch(
    (error) => {
      throw new FobiddenError("Failed to send email reset:: " + error);
    }
  );
};

const sendEmailSignup = async ({ email }) => {
  /**
   * 1. Check Email Exists
   */
  const user = await UserRepository.findUserByEmail({ email });
  if (user) throw new BadRequestError("Email Already Exists");

  /**
   * 2. Send Verify Email Token
   */
  await sendEmailToken({ email: email }).catch((error) => {
    throw new FobiddenError("Failed to send email token:: " + error);
  });
};

const signup = async ({ token }) => {
  /**
   * 1. Check Email Token
   */
  const { otp_email: email } = await OtpService.checkEmailOtp({ token });

  /**
   * 2. Hash Password
   */
  const passwordHash = await bcrypt.hash(email, 10);

  /**
   * 3. Get Role User
   */
  const role = await RoleRepository.getRoleByName({ name: "User" });
  if (!role) throw new FobiddenError("Role not found");

  /**
   * 4. Create User
   */
  const user = await UserRepository.createUser({
    email: email,
    password: passwordHash,
    role: role._id,
  });

  return {
    email: user.email,
    password: user.email,
  };
};

const login = async ({ email, password }) => {
  /**
   * 1. Check Email DB
   */
  const user = await UserRepository.findUserByEmail({ email });
  if (!user) throw new AuthFailureError("Emai chưa đăng ký");

  /**
   * 2. Check Password
   */
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AuthFailureError("Mật khẩu không chính xác");

  /**
   * 3. Check User is Active
   */
  if (!user.isActive) throw new FobiddenError("Tài khoản đã bị khóa");

  /**
   * 5. Create JWT Token
   */
  const payload = {
    userID: user._id,
    email: user.email,
    role: user.role.name,
  };

  const accessToken = signToken(payload);

  user.role = user.role.name; 

  return {
    user: Utils.unGetGetData(user, [
      "password",
      "createdAt",
      "updatedAt",
      "__v",
    ]),
    accessToken,
  };
};

const activeUser = async ({ email }) => {
  const user = await UserRepository.findUserByEmail({ email });
  if (!user) throw new NotFoundError("User not found");

  const newIsActive = !user.isActive;

  const updatedUser = await UserRepository.activeUser({
    userID: user._id,
    isActive: newIsActive,
  });
  return updatedUser;
};

const updateUserInfo = async ({ userID, update }) => {
  const updatedUser = await UserRepository.updateUser({ userID, update });
  if (updatedUser) {
    return "success";
  } else {
    return "failed";
  }
};

const getUsers = async ({ page, limit, status, search, sort }) => {
  let { users, pagination } = await UserRepository.getAll({
    page,
    limit,
    status,
    search,
    sort,
  });
  users = users.map((user) => ({
    ...user,
    role: user.role.name,
  }));
  return {
    users,
    pagination,
  };
};

const changePassword = async ({ userID, currentPassword, newPassword }) => {
  const user = await User.findById(userID).select("+password");
  if (!user) {
    throw new NotFoundError("User không tồn tại");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new AuthFailureError("Mật khẩu hiện tại không đúng");
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  user.password = passwordHash;
  await user.save();

  return 1;
};

module.exports = {
  signup,
  login,
  activeUser,
  sendEmailSignup,
  updateUserInfo,
  getUsers,
  changePassword,
  reset,
};
