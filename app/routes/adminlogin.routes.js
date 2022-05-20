module.exports = app => {
    const token = require("../controllers/token.controller.js");
    const adminlogin = require("../controllers/adminlogin.controller.js");
    const validator = require('../middlewares/validator');
    const auth = require('../middlewares/jwt-auth');
    const jwtAuth = require('../middlewares/jwt-auth');
    const apiAuth = require('../middlewares/header-auth');





    var router = require("express").Router();
    router.post("/create", [jwtAuth, apiAuth], adminlogin.create);
    app.use('/api/adminlogin', router);

};

