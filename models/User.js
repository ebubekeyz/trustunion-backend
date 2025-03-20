const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { log, timeStamp } = require('console');
const validator = require('validator');
const moment = require('moment');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please enter email'],
      validate: {
        validator: validator.isEmail,
        message: 'Please provide a valid email',
      },
      unique: true,
    },
    passport: {
      type: String,
      default: '/uploads/avatar.png',
    },
    balance: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
      minlength: [3, 'Name is too short'],
    },
    lastName: {
      type: String,
      required: true,
      minlength: [3, 'Name is too short'],
    },
    country: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
    },
     routingNumber: {
      type: String,
    },
    sortCode: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    accountOwnership: {
      type: String,
      enum: ['Individual', 'Joint Account', 'Trust Account'],
      required: true,
    },
    typeOfAccount: {
      type: String,
      enum: [
        'Savings Account',
        'Checking Account',
        'Money Market Account',
        'Certificate Of Deposit Account',
      ],
    },
    identity: {
      type: String,
      enum: [
        'Social Security Number',
        'Passport Number',
        "Driver's License Number ",
      ],
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
    },
    noc: {
      type: String,
    },
    idNumber: {
      type: Number,
      required: true,
    },
    occupation: {
      type: String,
      required: true,
    },
    terms: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },

    maritalStatus: {
      type: String,
      enum: [
        'Single',
        'Married',
        'Divorced',
        'Separated',
        'Widowed',
        'Registered Partnership',
      ],
      required: true,
    },
    employmentStatus: {
      type: String,
      enum: ['Student', 'Unemployed', 'Retired', 'Self-Employed', 'Employed'],
    },
    relationship: {
      type: String,
      enum: ['Brother', 'Father', 'Mother', 'Sister', 'Uncle', 'Aunt'],
    },
    role: {
      type: String,
      enum: ['admin', 'owner', 'user'],
      default: 'user',
    },
    date: {
      type: String,
      default: moment().format('YYYY-DD-MM'),
    },
  },
  { timestamps: true }
);
// test
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      country: this.country,
      idNumber: this.idNumber,
      phone: this.phone,
      accountOwnership: this.accountOwnership,
      typeOfAccount: this.typeOfAccount,
      identity: this.identity,
      occupation: this.occupation,
      address: this.address,
      dob: this.dob,
      accountNumber: this.accountNumber,
      maritalStatus: this.maritalStatus,
      email: this.email,
      role: this.role,
      sortCode: this.sortCode,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isWait = await bcrypt.compare(candidatePassword, this.password);
  return isWait;
};

module.exports = mongoose.model('User', UserSchema);
