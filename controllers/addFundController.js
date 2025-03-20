const AddFund = require('../models/AddFund');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../errors');

const createAddFund = async (req, res) => {
  // req.body.user = req.user.userId;
  const addFund = await AddFund.create(req.body);
  res.status(StatusCodes.CREATED).json({ attributes: addFund });
};

const getAllAddFunds = async (req, res) => {
  let { user, date, bank, status, accountName, accountNumber, amount, sort } =
    req.query;

  const queryObject = {
    user: req.user.userId,
  };

  let result = AddFund.find(queryObject);

  if (user) {
    result = AddFund.find({ user: req.user.userId, user: { $eq: user } });
  }

  if (accountNumber) {
    result = AddFund.find({
      user: req.user.userId,
      accountNumber: { $eq: accountNumber },
    });
  }
  if (bank) {
    result = AddFund.find(queryObject, {
      bank: { $regex: bank, $options: 'i' },
    });
  }

  if (accountName) {
    result = AddFund.find(queryObject, {
      accountName: { $regex: accountName, $options: 'i' },
    });
  }

  if (status) {
    result = AddFund.find({ user: req.user.userId, status: { $eq: status } });
  }
  if (sort === 'latest') {
    result = result.sort('-createdAt');
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt');
  }

  if (sort === 'a-z') {
    result = result.sort('accountName');
  }
  if (sort === 'z-a') {
    result = result.sort('-accountName');
  }

  if (amount) {
    result = AddFund.find({ user: req.user.userId, amount: { $lte: amount } });
  }

  if (date) {
    result = AddFund.find({
      user: req.user.userId,
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const addFund = await result;

  const totalAddFund = await AddFund.countDocuments();
  const numOfPage = Math.ceil(totalAddFund / limit);

  res.status(StatusCodes.OK).json({
    addFund: addFund,
    meta: {
      pagination: { page: page, total: totalAddFund, pageCount: numOfPage },
    },
  });
};

const getAddFunds = async (req, res) => {
  let { user, date, status, amount, sort } = req.query;

  let result = AddFund.find({});

  if (user) {
    result = AddFund.find({
      user: { $eq: user },
    });
  }

  if (status) {
    result = AddFund.find({
      status: { $eq: status },
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

  if (amount) {
    result = AddFund.find({ amount: { $lte: amount } });
  }

  if (date) {
    result = AddFund.find({
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 1000;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const addFund = await result;

  const totalAddFund = await AddFund.countDocuments();
  const numOfPage = Math.ceil(totalAddFund / limit);

  res.status(StatusCodes.OK).json({
    addFund: addFund,
    meta: {
      pagination: { page: page, total: totalAddFund, pageCount: numOfPage },
    },
  });
};

const getSingleAddFund = async (req, res) => {
  const { id: addFundId } = req.params;
  const addFund = await AddFund.findOne({ _id: addFundId });
  if (!addFund) {
    throw new BadRequestError(`AddFund with id ${addFundId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ addFund: addFund });
};

const editSingleAddFund = async (req, res) => {
  const { id: addFundId } = req.params;
  const addFund = await AddFund.findOneAndUpdate({ _id: addFundId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!addFund) {
    throw new BadRequestError(`AddFund with id ${addFundId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ addFund: addFund });
};

const editUserAddFund = async (req, res) => {
  const { id: userId } = req.params;
  const addFund = await AddFund.updateMany({ user: userId }, req.body);

  res.status(StatusCodes.OK).json({ addFund: addFund });
};

const deleteSingleAddFund = async (req, res) => {
  const { id: addFundId } = req.params;
  const addFund = await AddFund.findByIdAndDelete({ _id: addFundId });
  if (!addFund) {
    throw new BadRequestError(`AddFund with id ${addFundId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: 'AddFund Deleted' });
};

const deleteAllAddFunds = async (req, res) => {
  const addFund = await AddFund.deleteMany();
  res.status(StatusCodes.OK).json({ msg: 'AddFund Deleted' });
};

const deleteUserAddFund = async (req, res) => {
  const { id: userId } = req.params;
  const addFund = await AddFund.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'AddFund successfully deleted' });
};

module.exports = {
  getAddFunds,
  createAddFund,
  deleteUserAddFund,
  getAllAddFunds,
  getSingleAddFund,
  editSingleAddFund,
  deleteSingleAddFund,
  deleteAllAddFunds,
  editUserAddFund,
};
