import * as Joi from 'joi';

const joi = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production')
    .required()
    .messages({
      'any.required': `\n❌NODE_ENV should be defined❌\n`,
      'any.valid': `\n❌NODE_ENV should be defined❌\n`,
      'string.empty': `\n❌NODE_ENV is missing❌\n`,
    }),
  TYPEORM_URL: Joi.string().required().uri().messages({
    'any.required': `\n❌TYPEORM_URL should be defined❌\n`,
    'string.base': `\n❌TYPEORM_URL should be a string❌\n`,
    'string.empty': `\n❌TYPEORM_URL is empty❌\n`,
    'string.uri': `\n❌TYPEORM_URL is not valid database uri❌\n`,
  }),
  PORT: Joi.number().port().required().messages({
    'any.required': `\n❌PORT should be defined❌\n`,
    'number.base': `\n❌PORT should be a number❌\n`,
    'number.port': `\n❌PORT should be a TCP port, so between 0 and 65535❌\n`,
  }),
});

export default joi;
