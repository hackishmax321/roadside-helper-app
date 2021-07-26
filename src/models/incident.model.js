/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const uniqid = require('uniqid');
const { toJSON, paginate } = require('./plugins');
const { fileTypes } = require('../config/files');
const User = require('./user.model').schema;

const incidentSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },

        type: {
            type: String,
            required: true,
        },

        location: {
            coords: {
                type: {type: String, default: "Point"},
                coordinates: [Number]
            },
            name: {
                type: String,
            },
            more: {
                type: String,
            }
        }
    },
    {
        timestamps: true,
    }
);

// add plugin that converts mongoose to json
incidentSchema.plugin(toJSON);
// incidentSchema.plugin(paginate);

const Incident = mongoose.model('Incident', incidentSchema);

module.exports = Incident;