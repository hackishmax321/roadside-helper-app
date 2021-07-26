const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const admin = require('firebase-admin');

const loginFire = catchAsync(async (req, res) => {
    const idToken = req.body.idToken.toString();
    const expires = 3600;

    admin.auth().createSessionCookie(idToken, { expires }).then(
        (sessionCookie)=>{
            const options = { maxAge: expires, httpOnly:true};
            res.cookie("session", sessionCookie, options);
            res.end(JSON.stringify({status: 'success'}));

        },
        (error)=>{
            res.status(httpStatus.SERVICE_UNAVAILABLE).send({ user, tokens });
        }
    );
    res.status(httpStatus.CREATED).send({ user, tokens });
});

module.exports = {
    loginFire
}