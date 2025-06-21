const TEMPLATE = require('../../models/template.model');
const { VERIFY_EMAIL } = require('../../configs/contants');
const newTemplate = async ({ name, html }) => {
    const template = await TEMPLATE.create({
        tem_name: name,
        tem_html: html
    });
    return template;
}

const getTemplateByName = async ({ name }) => {
    const template = await TEMPLATE.findOne({ tem_name: name });
    return template;
}

// newTemplate({
//     name: 'verify-email',
//     html: VERIFY_EMAIL
// }).then(template => console.log('Template created:', template))
//   .catch(err => console.error('Error creating template:', err));

module.exports = { 
    newTemplate,
    getTemplateByName
};