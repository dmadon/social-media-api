const router = require('express').Router();
const {
    addThought,
    getThought,
    getAllThoughts,
    updateThought,
    deleteThought,
    deleteAllThoughts,
    addReaction,
    deleteReaction
} = require('../../controllers/thought-controller');

// this is the /api/thoughts route
router
    .route('/')
    .get(getAllThoughts)
    .post(addThought)
    .delete(deleteAllThoughts);

// this is the /api/thoughts/<thoughtId> route
router
    .route('/:thoughtId')
    .get(getThought)
    .put(updateThought)
    .delete(deleteThought);

// this is the /api/thoughts/<thoughtId>/reactions route
router
    .route('/:thoughtId/reactions')
    .post(addReaction);

// this is the /api/thoughts/<thoughtId>/reactions/<reactionId> route
router
    .route('/:thoughtId/reactions/:reactionId')
    .delete(deleteReaction);



module.exports = router;