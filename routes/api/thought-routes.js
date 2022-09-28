const router = require('express').Router();
const {
    addThought,
    getThought,
    getAllThoughts,
    deleteAllThoughts
} = require('../../controllers/thought-controller');

// this is the /api/thoughts/<userId> route
router
    .route('/:userId')
    .post(addThought);

// this is the /api/thoughts/<thoughtId> route
router
    .route('/:thoughtId')
    .get(getThought);

router
    .route('/')
    .get(getAllThoughts)
    .delete(deleteAllThoughts);

module.exports = router;