import Joi from 'joi'

export const locationSchema = {
  payload: Joi.object({
    locationMethod: Joi.string()
      .valid('upload', 'postcode', 'coordinates', 'draw')
      .required()
      .messages({
        'any.required':
          'Select how you want to provide your development site location',
        'any.only': 'Select a valid location method'
      }),
    crumb: Joi.string().allow('')
  })
}

export const coordinatesSchema = {
  payload: Joi.object({
    latitude: Joi.number().min(-90).max(90).required().messages({
      'any.required': 'Enter a latitude',
      'number.base': 'Enter a valid latitude',
      'number.min': 'Latitude must be between -90 and 90',
      'number.max': 'Latitude must be between -90 and 90'
    }),
    longitude: Joi.number().min(-180).max(180).required().messages({
      'any.required': 'Enter a longitude',
      'number.base': 'Enter a valid longitude',
      'number.min': 'Longitude must be between -180 and 180',
      'number.max': 'Longitude must be between -180 and 180'
    }),
    crumb: Joi.string().allow('')
  })
}

export const postcodeSchema = {
  payload: Joi.object({
    postcode: Joi.string()
      .pattern(/^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i)
      .required()
      .messages({
        'any.required': 'Enter a postcode',
        'string.pattern.base': 'Enter a valid UK postcode'
      }),
    crumb: Joi.string().allow('')
  })
}

export const developmentDetailsSchema = {
  payload: Joi.object({
    developmentName: Joi.string().min(1).max(200).required().messages({
      'any.required': 'Enter a development name',
      'string.empty': 'Enter a development name',
      'string.min': 'Development name must be at least 1 character',
      'string.max': 'Development name must be less than 200 characters'
    }),
    housesCount: Joi.number().integer().min(1).max(10000).required().messages({
      'any.required': 'Enter the number of houses',
      'number.base': 'Enter a valid number of houses',
      'number.min': 'Number of houses must be at least 1',
      'number.max': 'Number of houses must be less than 10,000'
    }),
    developmentType: Joi.string()
      .valid('residential', 'commercial', 'mixed')
      .required()
      .messages({
        'any.required': 'Select a development type',
        'any.only': 'Select a valid development type'
      }),
    wastewaterSite: Joi.string().required().messages({
      'any.required': 'Select a wastewater treatment site',
      'string.empty': 'Select a wastewater treatment site'
    }),
    crumb: Joi.string().allow('')
  })
}

export const fileUploadSchema = {
  payload: Joi.object({
    boundaryFile: Joi.any().required().messages({
      'any.required': 'Select a boundary file to upload'
    }),
    crumb: Joi.string().allow('')
  })
}
