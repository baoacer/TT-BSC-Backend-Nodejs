const OTPRepository = require('./repositories/otp.repo');
const Utils = require('../utils/index');
const { BadRequestError, FobiddenError } = require('../core/error.response');

const newOtp = async ({ email }) => {
    const otp = await OTPRepository.newOtp({
        token: await Utils.generatorTokenRandom(),
        email
    });
    return otp;
}

const checkEmailOtp = async ({ token }) => {
    const otp = await OTPRepository.getEmailByToken({ token });
    if (!otp) {
        throw new FobiddenError('OTP not found for this email');
    }

    await OTPRepository.deleteOtpByEmail({ email: otp.otp_email });
    return otp;
}

module.exports = {
    newOtp,
    checkEmailOtp
};