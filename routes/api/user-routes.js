const router = require('express').Router();
const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../../controllers/user-controller');

// these are the /api/users routes:
router
    .route('/')
    .get(getAllUsers)
    .post(createUser);

// these are the /api/users/:id routes:
router
    .route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;