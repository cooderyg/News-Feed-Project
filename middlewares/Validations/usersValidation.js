const Joi = require('joi');
const { user } = require('./message.json');

const userValidation = {
  signInValidation: async (req, res, next) => {
    const body = req.body;
    const schema = Joi.object().keys({
      email: Joi.string()
        .max(30)
        .regex(/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i)
        .required()
        .messages(user.email),
      password: Joi.string()
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
};

module.exports = userValidation;
