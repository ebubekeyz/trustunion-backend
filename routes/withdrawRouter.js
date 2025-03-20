const express = require('express');
const router = express.Router();

const auth = require('../middleware/authentication.js');
const authPermission = require('../middleware/authPermission.js');

const {
  createWithdraw,
  getSingleWithdraw,
  deleteSingleWithdraw,
  deleteAllWithdraws,
  getAllWithdraws,
  deleteUserWithdraw,
  editSingleWithdraw,
  getWithdraws,
  editUserWithdraw,
} = require('../controllers/withdrawController.js');

router
  .route('/')
  .get(auth, getAllWithdraws)
  .post(createWithdraw)
  .delete(auth, authPermission('admin', 'owner'), deleteAllWithdraws);

router.route('/allPack').get(getWithdraws);

router
  .route('/:id')
  .get(getSingleWithdraw)
  .delete(auth, authPermission('admin', 'owner'), deleteSingleWithdraw)
  .patch(auth, editSingleWithdraw);

router.route('/:id/deleteUserWithdraw').delete(auth, deleteUserWithdraw);
router.route('/:id/editUserWithdraw').patch(auth, editUserWithdraw);

module.exports = router;
