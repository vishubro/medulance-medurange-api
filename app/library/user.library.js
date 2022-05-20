const authService = require('../services/auth.service');
const jwt = require('jsonwebtoken');
const db = require("../models");
const Users = db.Userdetails;
const Op = db.Sequelize.Op;
// const SendOtp = require('sendotp');
const { sign } = require('crypto');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sendOtp = new SendOtp('163596A0HRl9F8B5959f279');
const { user_data_decrypt } = require('../middlewares/crypto');

//send otp
async function otp_login(mobile) {
    var condition = { 'mobile': mobile };
    const query = await Users.findAll({
        where: condition
    })
    if (query.length > 0) {
        let promise = new Promise(function (resolve, reject) {
            sendOtp.send("+91" + mobile, "MEDULA", function (error, data) {
                if (data.type == 'success') {
                    resolve({
                        message: "OTP sent",
                        status_code: 1
                    });
                } else {
                    reject({
                        message: "Something went wrong",
                        status_code: -3
                    });
                }
            })
        });
        return promise;
    }
    else {
        return { message: "User not found", status_code: -1 };
    }
}

//verify otp
async function otp_verify(mobile, otp) {
    let promise = new Promise(function (resolve, reject) {
        return sendOtp.verify("+91" + mobile, otp, function (error, data) {
            resolve(data);
        });
    });
    promise.then(function (result) {
        if (result && result.type && result.type == 'success') {
            const query = Users.findAll({
                where: { mobile: mobile }
            })
            if (query.length > 0) {
                const token = jwt.sign({ user_id: query[0]['id'] }, process.env.JWT_SECRET);
                delete query[0]['password'];
                delete query[0]['opassword'];
                return {
                    message: 'Success.',
                    status_code: 1,
                    user_data: query[0],
                    token: token
                };
            } else {
                return {
                    message: 'User not found',
                    status_code: -2
                };
            }
        } else {
            return {
                message: 'Something went wrong. try again.',
                status_code: -1
            };
        }
    })
    promise.catch(e => { console.log(e) })
}

//password login
async function password_login(user, password) {
    const user_type = validate(user);
    if (user_type) {
        if (user_type == 'email') {
            condition = { email: user };
        } else if (user_type == 'mobile') {
            condition = { mobile: user };
        }
        const query = await Users.findAll({
            where: condition
        });

        if (query.length > 0) {
            let promise = new Promise(function (resolve, reject) {
                bcrypt.compare(password, query[0]['password'], function (err, res) {
                    if (res) {
                        var userData = {};
                        const token = jwt.sign({ user_id: query[0]['id'] }, process.env.JWT_SECRET);
                        query.forEach(function (item) {
                            userData = item.dataValues;
                            delete userData['password'];
                            delete userData['opassword'];
                            userData = user_data_decrypt(userData);
                        })

                        resolve({
                            message: 'Success.',
                            status_code: 1,
                            user_data: userData,
                            token: token
                        });
                    } else {
                        resolve({
                            message: 'Invalid password.',
                            status_code: -3
                        });
                    }
                });

            });
            return promise;
        }
        else {
            return { message: "User not found", status_code: -2 };
        }
    } else {
        return { message: "Invalid email or mobile", status_code: -1 };
    }
}

function validate(string) {
    if (string) {
        var type;
        var email_filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        if (email_filter.test(string)) {
            type = 'email';
        }

        var mobile_filter = /^\d{10}$/;
        if (mobile_filter.test(string)) {
            type = 'mobile';
        }
        return type;
    }
}


module.exports = {
    otp_login: otp_login,
    otp_verify: otp_verify,
    password_login: password_login
}