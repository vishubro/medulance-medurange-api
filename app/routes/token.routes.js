module.exports = app => {
    const token = require("../controllers/token.controller.js");
    const Joi = require('joi');
    const validator = require('../middlewares/validator');
    const auth = require('../middlewares/jwt-auth');
    const schemaToken = Joi.object().keys({
        username: Joi.string().max(255),
        email: Joi.string().email().max(255)
    });
    const createschema = Joi.object().keys({
        username: Joi.string().max(255),
        email: Joi.string().email().max(255)
    });
    const updateschema = Joi.object().keys({
        username: Joi.string().max(255),
        email: Joi.string().email().max(255)
    });
    const findschema = Joi.object().keys({
        username: Joi.string().max(255),
        email: Joi.string().email().max(255)
    });

    var router = require("express").Router();

    // Create a new token

    router.post("/generatetoken", validator(schemaToken), token.generatetoken);
    router.post("/", [auth, validator(createschema)], token.create);
    router.put("/", [auth, validator(updateschema)], token.update);
    router.get("/", auth, token.findAll);
    router.post("/find", [auth, validator(findschema)], token.find);
    app.use('/api/token', router);
};