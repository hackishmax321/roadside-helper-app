const express = require('express');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
// const csrf = require("csurf");
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes/v1');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const cookieParser = require('cookie-parser');
const boodyParser = require('body-parser');
const admin = require("firebase-admin");

// const csrfMiddleware = csrf({ cookie: true });---------------[FLAG]
const app = express();

// Firebase Authentication INitialization
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// Views
app.set('views', path.join(__dirname, 'views'));

app.engine("html", require("ejs").renderFile);
app.set('view engine', 'html');

// set security HTTP headers
app.use(helmet());

// set Security for cookies
app.use(cookieParser());
// app.use(csrfMiddleware);-----------------------[FLAG]



// Json Body Parser
// app.use(boodyParser.urlencoded({extended:false}));
app.use(boodyParser.json());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());



// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.all("*", (req, res, next) => {
  // res.cookie("XSRF-TOKEN", req.csrfToken());-------------[FLAG]
  next();
});

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// -------------------------[ TEST ROUTES ]-------------------------------

// ---------------

// app.get("/login", function (req, res) {
//   res.render("login.html");
// });

// app.get("/signup", function (req, res) {
//   res.render("signup.html");
// });

// app.get("/profile", function (req, res) {
//   const sessionCookie = req.cookies.session || "";

//   admin
//     .auth()
//     .verifySessionCookie(sessionCookie, true /** checkRevoked */)
//     .then(() => {
//       res.render("profile.html");
//     })
//     .catch((error) => {
//       res.redirect("/login");
//     });
// });

// app.get("/", function (req, res) {
//   res.render("index.html");
// });

// app.post("/sessionLogin", (req, res) => {
//   const idToken = req.body.idToken.toString();

//   const expiresIn = 60 * 60 * 24 * 5 * 1000;

//   admin
//     .auth()
//     .createSessionCookie(idToken, { expiresIn })
//     .then(
//       (sessionCookie) => {
//         const options = { maxAge: expiresIn, httpOnly: true };
//         res.cookie("session", sessionCookie, options);
//         res.end(JSON.stringify({ status: "success" }));
//       },
//       (error) => {
//         res.status(401).send("UNAUTHORIZED REQUEST!");
//       }
//     );
// });

// app.get("/sessionLogout", (req, res) => {
//   res.clearCookie("session");
//   res.redirect("/login");
// });

// -----------------------------------------------------------------------

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
