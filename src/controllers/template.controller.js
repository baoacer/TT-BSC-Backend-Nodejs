const TemplateService = require("../services/template.service");
const { StatusCodes } = require("../utils/handler/http.status.code");

const createTemplate = async (req, res, next) => {
  try {
    const { name, html } = req.body
    res.status(StatusCodes.OK).json({
      metadata: await TemplateService.newTemplate({ name, html })
    })
  } catch (error) {
    next(error)
  }
};

const updateTemplate = async (req, res, next) => {
  
};

const deleteTemplate = async (req, res, next) => {
  
};

const getTemplate = async (req, res, next) => {
  
};

const getAllTemplates = async (req, res, next) => {
  
};

module.exports = { createTemplate, updateTemplate, deleteTemplate, getTemplate, getAllTemplates };
