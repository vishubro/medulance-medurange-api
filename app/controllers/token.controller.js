//const authService = require('../services/auth.service');
const jwt = require('jsonwebtoken');
const db = require("../models");
const Token = db.Tokens;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    // Create a User
    const token = {
        username: req.body.username,
        email: req.body.email
    };

    Token.create(token)
        .then(data => {
            res.send({
                message: "Token created successfully"
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Token."
            });
        });
};

exports.generatetoken = (req, res) => {

    var condition = req.body;
    Token.findAll({
        where:
            condition
    })
        .then(data => {
            if (data.length > 0) {
                const token = jwt.sign({ username: req.username, email: req.email }, process.env.JWT_SECRET);
                res.send({
                    token: token
                });
            }
            else {
                res.status(500).send({
                    message: "user not found"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "user not found"
            });
        });
};

exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

    Token.findAll({ where: condition })
        .then(data => {
            res.send({
                data: data
            });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "user not FindAll"
            });
        });
};


exports.find = (req, res) => {

    var condition = req.body;
    Token.findAll({
        where:
            condition

    })
        .then(data => {
            res.send(data);

        })
        .catch(err => {
            res.status(500).send({
                message: "user not FindOne"
            });
        });
};

exports.update = (req, res) => {
    const id = req.body.id;

    Token.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Token was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Token Maybe Token was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Token "
            });
        });
};
