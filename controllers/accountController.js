const Account = require('../models/Account');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../errors');

const createAccount = async (req, res) => {
  req.body.user = req.user.userId;
  const account = await Account.create(req.body);
  res.status(StatusCodes.CREATED).json({ attributes: account });
};

const getAllAccounts = async (req, res) => {
  let { user, date, name, accountNumber,routingNumber, bank, sort } = req.query;

  const queryObject = {
    user: req.user.userId,
  };

  let result = Account.find(queryObject);

  if (user) {
    result = Account.find({ user: req.user.userId, user: { $eq: user } });
  }

  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('name');
  }
  if (sort === 'z-a') {
    result = result.sort('-name');
  }

  if (accountNumber) {
    result = Account.find({
      user: req.user.userId,
      accountNumber: { $lte: accountNumber },
    });
  }
  if (routingNumber) {
    result = Account.find({
      user: req.user.userId,
      accountNumber: { $lte: accountNumber },
    });
  }

  if (name) {
    result = Account.find(queryObject, {
      name: { $regex: name, $options: 'i' },
    });
  }
  if (bank) {
    result = Account.find(queryObject, {
      bank: { $regex: bank, $options: 'i' },
    });
  }

  if (date) {
    result = Account.find(queryObject, {
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const account = await result;

  const totalAccount = await Account.countDocuments();
  const numOfPage = Math.ceil(totalAccount / limit);

  res.status(StatusCodes.OK).json({
    account: account,
    meta: {
      pagination: { page: page, total: totalAccount, pageCount: numOfPage },
    },
  });
};

const getAccounts = async (req, res) => {
  let { user, date, name, accountNumber, routingNumber, bank, sort } = req.query;

  let result = Account.find({});

  if (user) {
    result = Account.find({
      user: { $eq: user },
    });
  }

  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('name');
  }
  if (sort === 'z-a') {
    result = result.sort('-name');
  }

  if (accountNumber) {
    result = Account.find({ accountNumber: { $lte: accountNumber } });
  }
  if (routingNumber) {
    result = Account.find({ accountNumber: { $lte: accountNumber } });
  }

  if (name) {
    result = Account.find({
      name: { $regex: name, $options: 'i' },
    });
  }

  if (date) {
    result = Account.find({
      date: { $regex: date, $options: 'i' },
    });
  }

  if (bank) {
    result = Account.find({
      bank: { $regex: bank, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const account = await result;

  const totalAccount = await Account.countDocuments();
  const numOfPage = Math.ceil(totalAccount / limit);

  res.status(StatusCodes.OK).json({
    account: account,
    meta: {
      pagination: { page: page, total: totalAccount, pageCount: numOfPage },
    },
  });
};

const getSingleAccount = async (req, res) => {
  const { id: accountId } = req.params;
  const account = await Account.findOne({ _id: accountId });
  if (!account) {
    throw new BadRequestError(`Account with id ${accountId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ Account: Account });
};

const editSingleAccount = async (req, res) => {
  const { id: accountId } = req.params;
  const account = await Account.findOneAndUpdate({ _id: accountId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!account) {
    throw new BadRequestError(`Account with id ${accountId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ account: account });
};

const editUserAccount = async (req, res) => {
  const { id: userId } = req.params;
  const account = await Account.findOneAndUpdate({ user: userId }, req.body);

  res.status(StatusCodes.OK).json({ account: account });
};

const deleteSingleAccount = async (req, res) => {
  const { id: accountId } = req.params;
  const account = await Account.findByIdAndDelete({ _id: accountId });
  if (!account) {
    throw new BadRequestError(`Account with id ${accountId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Account Deleted' });
};

const deleteAllAccounts = async (req, res) => {
  const account = await Account.deleteMany();
  res.status(StatusCodes.OK).json({ msg: 'Account Deleted' });
};

const deleteUserAccount = async (req, res) => {
  const { id: userId } = req.params;
  const account = await Account.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'Account successfully deleted' });
};

module.exports = {
  getAccounts,
  createAccount,
  deleteUserAccount,
  getAllAccounts,
  getSingleAccount,
  editSingleAccount,
  deleteSingleAccount,
  deleteAllAccounts,
  editUserAccount,
};
