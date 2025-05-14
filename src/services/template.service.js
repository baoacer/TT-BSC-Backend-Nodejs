'use strict'
const TEMPLATE = require('../models/template.model')
const { htmlEmailToken } = require('../utils/tem.html')

class TemplateService {
    static async newTemplate({
        tem_name = null,
        tem_html = null
    }){
        return await TEMPLATE.create({
            tem_name, // unique
            tem_html: htmlEmailToken()
        }).lean()
    }

    static async getTemplate({
        tem_name = null
    }){
        return await TEMPLATE.findOne({ tem_name })
    }
}

module.exports = TemplateService