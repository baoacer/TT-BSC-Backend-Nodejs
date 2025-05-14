'use strict'
const OtpService = require('./otp.service')
const TemplateService = require('./template.service')

class EmailService {
    static async sendEmailToken({ email = null }){
        try {
            //1. get token
            const token = await OtpService.newOtp({ email })

            // 2. get template
            const template = await TemplateService.getTemplate('HTML EMAIL TOKEN')

            // 3. send email - aws
        } catch (error) {
            throw new Error('Error sending email')
        }
    }
}

module.exports = EmailService