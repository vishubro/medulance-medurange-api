const db = require("../models");
const userlib = require("../library/user.library");
var request = require('request');
const jwt = require('jsonwebtoken');
const adminlogin = db.adminlogin;
const Op = db.Sequelize.Op;

exports.registerUser = async (req, res) => {
    const api = adminloginApi.REGISTER_USER;
    try {
        const data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            mobile: req.body.mobile,
            username: req.body.username,
            gender: req.body.gender
        };
        const response = await adminlogin.callPostApi(api, data);
        res.send(response.data);
    } catch (error) {
        console.log("Error in" + api, error.response.data);
        res.status(201).send({
            status: 0,
            success: false,
            message: error.response.data || ''
        })
    }
}
exports.loginUser = async (req, res) => {
    const api = adminloginApi.LOGIN_USER;
    try {
        const data = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            mobile: req.body.mobile,
            username: req.body.mobile,

        }
        const response = await adminlogin.callPostApi(api, data);
        res.send(response.data);
    } catch (error) {
        console.log("Error in" + api, error.response);
        res.status(201).send({
            status: 0,
            success: false,
            message: error.response.data || ''
        })
    }
}

