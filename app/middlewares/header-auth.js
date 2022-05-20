const db = require("../models");
var md5 = require('md5');
const adminlogin = db.adminlogin;

const adminloginAuth = (req, res, next) => {
    let api_key = req.headers['api-key'] ? req.headers['api-key'] : '';
    if (api_key) {
        api_key = api_key.split('-');
        const adminlogin = Buffer.from(api_key[0], 'base64').toString();
        var condition = {
            id: brand_id
        };
        adminlogin.findAll({ where: condition })
            .then(data => {
                if (data.length > 0) {
                    const org_key = data[0]['api_key'];
                    const org_api_key = md5("MEDU||" + org_key);
                    if (api_key[1] === org_api_key) {
                        req.body.brand_id = brand_id;
                        next();
                    } else {
                        res.send({
                            message: 'Invalid api key',
                            status_code: -4
                        });
                    }
                } else {
                    res.send({
                        message: 'Invalid api key',
                        status_code: -4
                    });
                }
            })
            .catch(err => {
                return res.status(403).send({
                    message: 'Something went wrong',
                    status: -3
                });
            });
    } else {
        res.status(401).send({
            message: 'Api key missing',
            status: -2
        });
    }
};
module.exports = adminloginAuth;