const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication.js');
const authPermission = require('../middleware/authPermission.js');

const {
  createAccount,
  getSingleAccount,
  deleteSingleAccount,
  deleteAllAccounts,
  getAllAccounts,
  deleteUserAccount,
  editSingleAccount,
  getAccounts,
  editUserAccount,
} = require('../controllers/accountController.js');

router
  .route('/')
  .get(auth, getAllAccounts)
  .post(auth, createAccount)
  .delete(auth, authPermission('admin', 'owner'), deleteAllAccounts);

router.route('/allAccount').get(getAccounts);

router
  .route('/:id')
  .get(getSingleAccount)
  .delete(auth, authPermission('admin', 'owner'), deleteSingleAccount)
  .patch(auth, editSingleAccount);

router.route('/:id/deleteUserAccount').delete(auth, deleteUserAccount);
router.route('/:id/editUserAccount').patch(auth, editUserAccount);

module.exports = router;
