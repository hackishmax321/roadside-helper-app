const passport = require('passport');
const cookieSession = require('cookie-session');
// const cookieParser = require('cookie-parser');

module.exports = (router) => {

    // router.use(cookieParser);

    // Cookie and Passport Settings
    router.use(cookieSession({
        name: 'session',
        maxAge: 24*60*60*1000,
        keys: ['skeysamp']
    }))

    router.use(passport.initialize());
    router.use(passport.session());

    // Passport Setup
    require('../../config/passport.oauth2');


    const loginCheck = (req, res, next) => {
        if(req.user){
            next();
        } else {
            res.sendStatus(401);
        }
    }

    const cookieCheck = (req, res, next) => {
        console.log("Launching Cookie check" + res.cookie());
        if(res.cookie()){
            res.send(req.cookie);
        } else {
            // res.redirect('/v1/auth/login/google/success');
            // next();
        }
    }

    router.get('/', (req, res) => {
        res.send("This is Login Menu");
    });

    // router.get('/loginnow', cookieCheck);

    router.get('/login/google/success', loginCheck, (req, res)=>{
        res.send(req.user);
        // res.cookie('user', req.user, {maxAge: 12*60*60*1000});
    });

    router.get('/login/google/failure', (req, res) => {
        res.send("Login Failed!");
    });

    router.get('/login/google', 
        passport.authenticate('google', { scope:
        ['profile', 'email'] }
    ));

    router.get('/login/google/callback',
        passport.authenticate( 'google', {
            successRedirect: '/v1/auth/login/google/success',
            failureRedirect: '/v1/auth/login/google/failure'
    }));

    router.get('/login/facebook', passport.authenticate('facebook'));

    router.get('/login/facebook/callback',
        passport.authenticate( 'facebook', {
            successRedirect: '/v1/auth/login/google/success',
            failureRedirect: '/v1/auth/login/google/failure'
    }));

    router.get('/logout', (req, res)=>{
        req.session = null;
        req.logOut();
        res.redirect('/v1/auth');
    })
}