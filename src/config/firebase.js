const dotenv = require('dotenv');
const path = require('path');
const joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envFireSchema = joi.object()
    .keys({
        API_KEY: joi.string().required().description('Firebase API key'),
        AUTH_DOM: joi.string().required().description('Firebase Authentication Domain'),
        PROJECT_ID: joi.string().required().description('Firebase Project ID'),
        STORAGE_BUCKET: joi.string().required().description('Firebase Storage Bucket'),
        MSENDER_ID: joi.string().required().description('Firebase Message Sender ID'),
        APP_ID: joi.string().required().description('Firebase App ID'),
        MEASURE_ID: joi.string().required().description('Firebase Measure ID'),

    }).unknown();

const { value: envFire, error } = envFireSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if(error) {
    throw new Error(`Config validation error: ${error.message}`);
}

// Firebase Credentials
module.exports = {
    apiKey: envFire.API_KEY,
    authDomain: envFire.AUTH_DOM,
    projectId: envFire.PROJECT_ID,
    storageBucket: envFire.STORAGE_BUCKET,
    messagingSenderId: envFire.MSENDER_ID,
    appId: envFire.APP_ID,
    measurementId: envFire.MEASURE_ID
}