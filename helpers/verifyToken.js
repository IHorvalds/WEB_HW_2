const jwt = require('jsonwebtoken');


module.exports = function(req, res, next) {
    const token = req.cookies['auth-token'];
    if (!token) {
        // return res.status(401).send('Access denied');
        req.user = undefined;
        next();
        return;
    }

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch {
        return res.status(400).send('Bad token');
    }
}