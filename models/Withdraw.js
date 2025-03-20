const mongoose = require('mongoose');
const moment = require('moment');

const WithdrawSchema = new mongoose.Schema(
  {
    bank: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    narration: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'sent'],
      default: 'pending',
    },
    date1: {
      type: String,
    },
    date2: {
      type: String,
    },
    date: {
      type: String,
      default: moment().format('YYYY-DD-MM'),
    },
    user: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Withdraw', WithdrawSchema);
