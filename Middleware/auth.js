const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretkey = process.env.JWT_SECRET

const auth = (req, res, next) => {
    //const token = req.header("Authorization").replace("Bearer"," ");
    //or
    const token = req.header("Authorization").split(" ")[1];
    if (!token) return res.status(401).json({ error: "token required" });
    try {
        const decoded = jwt.verify(token, secretkey);

        req.user = decoded.userid;
        console.log(req.user );
        next();
    } catch (err) {
        res.status(400).json({ error: "invalid token" });
    }
};
module.exports = auth;