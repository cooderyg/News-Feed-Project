const Joi = require('joi');
const { user } = require('./message.json');

const userValidation = {
  signInValidation: async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object().keys({
      email: Joi.string()
        .empty()
        .max(30)
        .regex(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i)
        .required()
        .messages(user.email),
      password: Joi.string()
        .empty()
        .min(8)
        .max(20)
        .regex(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/)
        .required()
        .messages(user.password),
    });

    try {
      await schema.validateAsync(body);
    } catch (err) {
      return res.status(412).json({ message: err.message });
    }

    next();
  },
  signUpValidation: async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object().keys({
      email: Joi.string()
        .empty()
        .max(30)
        .regex(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i)
        .required()
        .messages(user.email),
      name: Joi.string()
        .empty()
        .regex(/^[가-힣a-zA-Z]+$/)
        .required()
        .messages(user.name),
      password: Joi.string()
        .empty()
        .min(8)
        .max(20)
        .regex(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/)
        .required()
        .messages(user.password),
      confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages(user.confirmPassword),
    });

    try {
      await schema.validateAsync(body);
    } catch (err) {
      return res.status(412).json({ message: err.message });
    }

    next();
  }, //currentPassword, editPassword, editConfirmPassword
  editPasswordValidation: async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object().keys({
      currentPassword: Joi.string()
        .empty()
        .min(8)
        .max(20)
        .regex(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/)
        .required()
        .messages(user.currentPassword),
      editPassword: Joi.string()
        .empty()
        .min(8)
        .max(20)
        .regex(/^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+])/)
        .required()
        .messages(user.editPassword),
      editConfirmPassword: Joi.string().valid(Joi.ref('editPassword')).required().messages(user.editConfirmPassword),
    });

    try {
      await schema.validateAsync(body);
    } catch (err) {
      return res.status(412).json({ message: err.message });
    }

    next();
  },
};

module.exports = userValidation;
