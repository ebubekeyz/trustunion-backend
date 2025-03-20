const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../errors');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const registerUser = async (req, res) => {
  let {
    idNumber,
    accountNumber,
    email,
    lastName,
    firstName,
    gender,
    country,
    phone,
    accountOwnership,
    routingNumber,
    sortCode,
    typeOfAccount,
    identity,
    occupation,
    address,
    maritalStatus,
    dob,
    terms,
    password,
    role,
  } = req.body;

  const getRandomTenDigit = () => {
    return Math.floor(Math.random() * 10000000000);
  };

  let randomTenDigit = getRandomTenDigit();

  const getRandomEightDigit = () => {
    return Math.floor(Math.random() * 100000000);
  };

  let randomEightDigit = getRandomEightDigit();



   const getRandomNineDigit = () => {
    return Math.floor(Math.random() * 1000000000);
  };

  let randomNineDigit = getRandomNineDigit();

  const user = await User.create({
    role,
    idNumber,
    accountNumber: randomTenDigit,
    routingNumber: randomNineDigit,
    sortCode: randomEightDigit,
    email,
    lastName,
    firstName,
    gender,
    country,
    phone,
    accountOwnership,
    typeOfAccount,
    identity,
    occupation,
    address,
    terms,
    maritalStatus,
    dob,
    password,
  });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user: user, token: token });
};

const loginUser = async (req, res) => {
  const { email, password, otp } = req.body;
  if (!email) {
    throw new BadRequestError('Please provide an email');
  }
  if (!password) {
    throw new BadRequestError('Please provide a password');
  }
  const user = await User.findOne({ email });
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Password did not match');
  }

  const token = user.createJWT();

  const getRandomTenDigit = () => {
    return Math.floor(Math.random() * 1000000);
  };
  let randomTenDigit = getRandomTenDigit();

  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: process.env.GMAIL_PORT,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: `"Trust Union Bank" <customercare.trustunion-bank@gmail.com>`,
    to: `${email}`,
    subject: `One Time Password`,
    html: `<div style="text-align: center; margin: 1rem auto; background: #3346c4; padding: 0.5rem 0.5rem">
    <p style="color: white;">Otp Code: </p>
    <h1 style="font-style: italic; color: white">${randomTenDigit}</h1>
    </div>`,
  });

  res
    .status(StatusCodes.OK)
    .json({ user: user, token: token, otp: randomTenDigit });
};
const getAllUsers = async (req, res) => {
  let { sort, name, accountNumber, email, ref, date, balance } = req.query;

  let result = User.find({});

  if (name) {
    result = User.find({ name: { $regex: name, $options: 'i' } });
  }

  if (ref) {
    result = User.find({ ref: { $eq: ref } });
  }
  if (accountNumber) {
    result = User.find({ accountNumber: { $eq: accountNumber } });
  }
  if (balance) {
    result = User.find({ balance: { $eq: balance } });
  }
  if (date) {
    result = Order.find(queryObject, {
      date: { $regex: date, $options: 'i' },
    });
  }

  if (email) {
    result = User.find({
      email: { $regex: email, $options: 'i' },
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

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 1000;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const users = await result;

  const totalUsers = await User.countDocuments();
  const numOfPage = Math.ceil(totalUsers / limit);

  res.status(StatusCodes.OK).json({
    users: users,
    meta: {
      pagination: { page: page, total: totalUsers, pageCount: numOfPage },
    },
  });
};

const getSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }

  res.status(StatusCodes.OK).json({ user: user });
};

const editSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: user, token: token });
};

const deleteSingleUser = async (req, res) => {
  const { id: userId } = req.params;
  const user = await User.findByIdAndDelete({ _id: userId });
  if (!user) {
    throw new BadRequestError(`User with id ${userId} does not exist`);
  }
  res.status(StatusCodes.OK).json({ msg: 'User Deleted' });
};

const deleteAllUsers = async (req, res) => {
  const user = await User.deleteMany();
  res.status(StatusCodes.OK).json({ msg: 'Users Deleted' });
};

const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new BadRequestError('Please provide both values');
  }

  const user = await User.findOne({ _id: req.user.userId });
  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new UnauthorizedError('Password did not match existing user');
  }

  user.password = newPassword;

  await user.save();

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user: user, token: token });
};

const emailPassword = async (req, res) => {
  const { email } = req.body;

  const checkEmail = await User.findOne({ email });
  if (!checkEmail) {
    throw new BadRequestError('Email does not exist');
  }

  res.status(StatusCodes.OK).json({ user: checkEmail });
};

const passwordReset = async (req, res) => {
  const { newPassword, password } = req.body;

  if (newPassword !== password) {
    throw new BadRequestError('Password did not match');
  }

  if (!newPassword || !password) {
    throw new BadRequestError('No field must be empty');
  }

  const { id: userId } = req.params;

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const user = await User.findOneAndUpdate(
    { _id: userId },
    { newPassword, password: hashPassword },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new UnauthorizedError(`No user with id ${userId} `);
  }

  const token = user.createJWT();

  res
    .status(StatusCodes.OK)
    .json({ user: user, token: token, msg: 'Password has been reset' });
};

module.exports = {
  passwordReset,
  showCurrentUser,
  registerUser,
  loginUser,
  getAllUsers,
  getSingleUser,
  editSingleUser,
  deleteSingleUser,
  deleteAllUsers,
  updateUserPassword,
  emailPassword,
};
