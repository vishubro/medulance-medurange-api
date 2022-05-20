const jwt = require('jsonwebtoken');
const accessTokenSecret = process.env.JWT_SECRET;

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.status(403).send({
                    message: 'Invalid token',
                });
            }

            req.user = user;
            next();
        });
    } else {
        res.status(401).send({
            message: 'Authorization is required',
        });
    }
};
module.exports = authenticateJWT;