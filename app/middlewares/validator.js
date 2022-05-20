const Joi = require('joi');
const validator = (schema, property) => {
    return (req, res, next) => {
        let match = property ? req.body[property] : req.body;
        const { error } = Joi.validate(match, schema);
        const valid = error == null;

        if (valid) {
            next();
        } else {
            const { details } = error;
            const message = details.map(i => i.message).join(',');
            res.status(422).json({ error: message })
        }
    }
}
module.exports = validator;