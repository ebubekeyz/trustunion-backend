const mongoose = require('mongoose');
const moment = require('moment');
const validator = require('validator');

const AccountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    bank: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    routingNumber: {
      type: String,
      required: true,
    },
    pin: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      default: moment().format('YYYY-DD-MM'),
    },
    status: {
      type: String,
      enum: ['true', 'false'],
      default: 'false',
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', AccountSchema);
