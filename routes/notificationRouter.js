const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication.js');
const authPermission = require('../middleware/authPermission.js');

const {
  createNotification,
  getSingleNotification,
  deleteSingleNotification,
  deleteAllNotifications,
  getAllNotifications,
  deleteUserNotification,
  editSingleNotification,
  getNotifications,
  editUserNotification,
} = require('../controllers/notificationController.js');

router
  .route('/')
  .get(auth, getAllNotifications)
  .post(auth, createNotification)
  .delete(auth, authPermission('admin', 'owner'), deleteAllNotifications);

router.route('/allNotification').get(getNotifications);

router
  .route('/:id')
  .get(getSingleNotification)
  .delete(auth, authPermission('admin', 'owner'), deleteSingleNotification)
  .patch(auth, editSingleNotification);

router
  .route('/:id/deleteUserNotification')
  .delete(auth, deleteUserNotification);
router.route('/:id/editUserNotification').patch(auth, editUserNotification);

module.exports = router;
