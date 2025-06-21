const OTP = require('../../models/opt.model');

const newOtp = async ({ token, email }) => {
    const otp = await OTP.create({
        otp_token: token,
        otp_email: email
    });
    return otp;
}

const getEmailByToken = async ({ token }) => {
    const otp = await OTP.findOne({ otp_token: token });
    return otp;
}

const deleteOtpByEmail = async ({ email }) => {
    await OTP.deleteOne({ otp_email: email });
}

module.exports = {
    newOtp,
    getEmailByToken,
    deleteOtpByEmail
};