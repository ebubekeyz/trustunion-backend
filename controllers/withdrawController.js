const Withdraw = require('../models/Withdraw');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../errors');

const createWithdraw = async (req, res) => {
  const withdraw = await Withdraw.create(req.body);
  res.status(StatusCodes.CREATED).json({ attributes: withdraw });
};

const getAllWithdraws = async (req, res) => {
  let { user, date, status, amount, sort } = req.query;

  const queryObject = {
    user: req.user.userId,
  };

  let result = Withdraw.find(queryObject);

  if (user) {
    result = Withdraw.find({ user: req.user.userId, user: { $eq: user } });
  }

  if (status) {
    result = Withdraw.find({ user: req.user.userId, status: { $eq: status } });
  }

  if (amount) {
    result = Withdraw.find({ user: req.user.userId, amount: { $eq: amount } });
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
    result = Withdraw.find({ user: req.user.userId, amount: { $eq: amount } });
  }

  if (date) {
    result = Withdraw.find(queryObject, {
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const withdraw = await result;

  const totalWithdraw = await Withdraw.countDocuments();
  const numOfPage = Math.ceil(totalWithdraw / limit);

  res.status(StatusCodes.OK).json({
    withdraw: withdraw,
    meta: {
      pagination: { page: page, total: totalWithdraw, pageCount: numOfPage },
    },
  });
};

const getWithdraws = async (req, res) => {
  let { user, date, status, amount, sort } = req.query;

  let result = Withdraw.find({});

  if (user) {
    result = Withdraw.find({
      user: { $eq: user },
    });
  }

  if (status) {
    result = Withdraw.find({
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
    result = Withdraw.find({ amount: { $lte: amount } });
  }

  if (date) {
    result = Withdraw.find({
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 1000;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const withdraw = await result;

  const totalWithdraw = await Withdraw.countDocuments();
  const numOfPage = Math.ceil(totalWithdraw / limit);

  res.status(StatusCodes.OK).json({
    withdraw: withdraw,
    meta: {
      pagination: { page: page, total: totalWithdraw, pageCount: numOfPage },
    },
  });
};

const getSingleWithdraw = async (req, res) => {
  const { id: withdrawId } = req.params;
  const withdraw = await Withdraw.findOne({ _id: withdrawId });
  if (!withdraw) {
    throw new BadRequestError(`Withdraw with id ${withdrawId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ withdraw: withdraw });
};

const editSingleWithdraw = async (req, res) => {
  const { id: withdrawId } = req.params;
  const withdraw = await Withdraw.findOneAndUpdate(
    { _id: withdrawId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!withdraw) {
    throw new BadRequestError(`Withdraw with id ${withdrawId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ withdraw: withdraw });
};

const editUserWithdraw = async (req, res) => {
  const { id: userId } = req.params;
  const withdraw = await Withdraw.updateMany({ user: userId }, req.body);

  res.status(StatusCodes.OK).json({ withdraw: withdraw });
};

const deleteSingleWithdraw = async (req, res) => {
  const { id: withdrawId } = req.params;
  const withdraw = await Withdraw.findByIdAndDelete({ _id: withdrawId });
  if (!Withdraw) {
    throw new BadRequestError(`Withdraw with id ${withdrawId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: 'Withdraw Deleted' });
};

const deleteAllWithdraws = async (req, res) => {
  const withdraw = await Withdraw.deleteMany();
  res.status(StatusCodes.OK).json({ msg: 'Withdrawals Deleted' });
};

const deleteUserWithdraw = async (req, res) => {
  const { id: userId } = req.params;
  const withdraw = await Withdraw.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'Withdraw successfully deleted' });
};

module.exports = {
  getWithdraws,
  createWithdraw,
  deleteUserWithdraw,
  getAllWithdraws,
  getSingleWithdraw,
  editSingleWithdraw,
  deleteSingleWithdraw,
  deleteAllWithdraws,
  editUserWithdraw,
};
