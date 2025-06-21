const TemplateRepository = require('./repositories/template.repo');
const { VERIFY_EMAIL, RESET_PASSWORD_EMAIL } = require('../configs/contants')

const newTemplate = async ({ name, html }) => {
    const template = await TemplateRepository.newTemplate({ name, html });
    return template;
}

const getTemplateByName = async ({ name }) => {
    const template = await TemplateRepository.getTemplateByName({ name });
    return template;
}

// newTemplate({
//     name: 'reset-password',
//     html: RESET_PASSWORD_EMAIL
// })

module.exports = {
    newTemplate,
    getTemplateByName
};