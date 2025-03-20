const Notification = require('../models/Notification');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthorizedError } = require('../errors');

const createNotification = async (req, res) => {
  req.body.user = req.user.userId;
  const notification = await Notification.create(req.body);
  res.status(StatusCodes.CREATED).json({ attributes: notification });
};

const getAllNotifications = async (req, res) => {
  let { user, date, status, name, subject, sort } = req.query;

  const queryObject = {
    user: req.user.userId,
  };

  let result = Notification.find(queryObject);

  if (user) {
    result = Notification.find({ user: req.user.userId, user: { $eq: user } });
  }

  if (status) {
    result = Notification.find({
      user: req.user.userId,
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

  if (name) {
    result = Notification.find(queryObject, {
      name: { $regex: name, $options: 'i' },
    });
  }

  if (subject) {
    result = Notification.find(queryObject, {
      subject: { $regex: subject, $options: 'i' },
    });
  }

  if (date) {
    result = Notification.find(queryObject, {
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const notification = await result;

  const totalNotification = await Notification.countDocuments();
  const numOfPage = Math.ceil(totalNotification / limit);

  res.status(StatusCodes.OK).json({
    notification: notification,
    meta: {
      pagination: {
        page: page,
        total: totalNotification,
        pageCount: numOfPage,
      },
    },
  });
};

const getNotifications = async (req, res) => {
  let { user, date, status, name, subject, sort } = req.query;

  let result = Notification.find({});

  if (user) {
    result = Notification.find({
      user: { $eq: user },
    });
  }

  if (status) {
    result = Notification.find({
      status: { $regex: status, $options: 'i' },
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

  if (name) {
    result = Notification.find({
      name: { $regex: name, $options: 'i' },
    });
  }

  if (subject) {
    result = Notification.find({
      subject: { $regex: subject, $options: 'i' },
    });
  }

  if (date) {
    result = Notification.find({
      date: { $regex: date, $options: 'i' },
    });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  const notification = await result;

  const totalNotification = await Notification.countDocuments();
  const numOfPage = Math.ceil(totalNotification / limit);

  res.status(StatusCodes.OK).json({
    notification: notification,
    meta: {
      pagination: {
        page: page,
        total: totalNotification,
        pageCount: numOfPage,
      },
    },
  });
};

const getSingleNotification = async (req, res) => {
  const { id: notificationId } = req.params;
  const notification = await Notification.findOne({ _id: notificationId });
  if (!notification) {
    throw new BadRequestError(
      `Notification with id ${notificationId} does not exist`
    );
  }

  res.status(StatusCodes.OK).json({ notification: notification });
};

const editSingleNotification = async (req, res) => {
  const { id: notificationId } = req.params;
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!notification) {
    throw new BadRequestError(
      `Notification with id ${notificationId} does not exist`
    );
  }
  res.status(StatusCodes.OK).json({ notification: notification });
};

const editUserNotification = async (req, res) => {
  const { id: userId } = req.params;
  const notification = await Notification.updateMany(
    { user: userId },
    req.body
  );

  res.status(StatusCodes.OK).json({ notification: notification });
};

const deleteSingleNotification = async (req, res) => {
  const { id: notificationId } = req.params;
  const notification = await Notification.findByIdAndDelete({
    _id: notificationId,
  });
  if (!notification) {
    throw new BadRequestError(
      `Notification with id ${notificationId} does not exist`
    );
  }
  res.status(StatusCodes.OK).json({ msg: 'Notification Deleted' });
};

const deleteAllNotifications = async (req, res) => {
  const notification = await Notification.deleteMany();
  res.status(StatusCodes.OK).json({ msg: 'Notification Deleted' });
};

const deleteUserNotification = async (req, res) => {
  const { id: userId } = req.params;
  const notification = await Notification.deleteMany({ user: userId });

  res.status(StatusCodes.OK).json({ msg: 'Notification successfully deleted' });
};

module.exports = {
  getNotifications,
  createNotification,
  deleteUserNotification,
  getAllNotifications,
  getSingleNotification,
  editSingleNotification,
  deleteSingleNotification,
  deleteAllNotifications,
  editUserNotification,
};
