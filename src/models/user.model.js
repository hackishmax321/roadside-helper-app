/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: 'http://storage-bucket/im'
    },

    status: {
      type: String,
      enum: ["NOT APPROVED", "APPROVED", "BLOCKED"],
      default: "NOT APPROVED",
    },
  },
  {
    timestamps: true,
  }
);

const userDetailsSchema = mongoose.Schema(
  {
    user:{
      // type:mongoose.Schema.Types.ObjectId,
      // ref: 'User',
      type: String,
      required: true,
    },
    info: {},
    settings: {},
    contribution: {
      votes: [],
      likes: [],
      issues: [],
    },
    history: {
      logs: []
    }
    
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */

// userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
//   const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
//   return !!user;
// };

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
// userSchema.methods.isPasswordMatch = async function (password) {
//   const user = this;
//   return bcrypt.compare(password, user.password);
// };

// userSchema.pre('save', async function (next) {
//   const user = this;
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);
// const UserDEtails = mongoose.model('UserDetails', userDetailsSchema);

module.exports = User;
