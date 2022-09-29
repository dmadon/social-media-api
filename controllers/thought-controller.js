const {User, Thought} = require('../models');

const thoughtController = {
    
    // create a new thought and assign it to the user
    addThought({body},res){
        Thought.create(
            {thoughtText:body.thoughtText,username:body.username}
        )
        .then(newThought => {
            return User.findOneAndUpdate(
                {_id:body.userId},
                {$addToSet:{thoughts:newThought._id}},
                {new:true}
            )
            .then(updatedUser => {
                if(!updatedUser){
                    res.status(404).json({message:'No user found with that id.'});
                    return;
                }
                else{
                    res.json(updatedUser)
                }
            })
            .catch(err => res.json(err))
        })
    },

    // get a thought by its id
    getThought({params},res){
        Thought.findOne(
            {_id:params.thoughtId}
        )
        .then(dbThoughtData => {
            if(!dbThoughtData){
                res.status(404).json({message:'No thought found with that id.'});
                return;
            }
            res.json(dbThoughtData)
        })
        .catch(err => res.json(err));
    },

    // get all thoughts
    getAllThoughts(req,res){
        Thought.find({})
            .then(dbThoughtData => {
                res.json(dbThoughtData)
            })
            .catch(err => res.json(err));
    },

    // update a thought by id
    updateThought({params,body},res){
        Thought.findOneAndUpdate(
            {_id:params.thoughtId},
            body,
            {new:true, runValidators:true}
        )
        .then(updatedThought => {
            if(!updatedThought){
                res.status(404).json({message:'No thought found with that id.'});
                return;
            }
            else{
                res.json(updatedThought)
            }
        })
        .catch(err => res.json(err));
    },

    // delete a thought by id
    deleteThought({params},res){
        Thought.findOneAndDelete(
            {_id:params.thoughtId}
        )
        .then(deletedThought => {
            if(!deletedThought){
                res.status(404).json({message:'No thought found with that id.'});
                return;
            }
            else{
                User.findOneAndUpdate(
                    {username:deletedThought.username},
                    {$pull:{thoughts:deletedThought._id}},
                    {new:true}
                    )
                    .then(updatedUser => {
                        if(!updatedUser){
                            res.status(404).json('The associated username was not found.')
                        }
                        else{
                            res.json(updatedUser)
                        }
                    })
                    .catch(err => res.json(err));
            }
        })
        .catch(err => res.json(err));        
    },

    // delete all thoughts
    deleteAllThoughts(req,res){
        Thought.deleteMany({})
            .then(deletedThoughts => {
                if(!deletedThoughts){
                    res.json({message:'No thoughts were found.'})
                }
                res.json({message:'All thoughts successfully deleted.'})
            })
            .catch(err => res.json(err));               
    },

    // create a reaction to a post
    addReaction({params,body},res){
        Thought.findOneAndUpdate(
            {_id:params.thoughtId},
            {$addToSet:{reactions:{reactionBody:body.reactionBody,username:body.username}}},
            {new:true, runValidators:true}
        )
        .then(updatedThought => {
            if(!updatedThought){
                res.status(404).json({message:'No thought found with that id.'});
                return;
            }
            else{
                console.log(body)
                res.json(updatedThought);
            }
        })     
        .catch(err => res.json(err));           
    },

    deleteReaction({params},res){
        Thought.findOneAndUpdate(
            {_id:params.thoughtId},
            {$pull: {reactions:{reactionId:params.reactionId}}},
            {new:true}
        )
        .then(updatedThought => {
            if(!updatedThought){
                res.status(404).json({message:'No thought found with that id.'});
                return;
            }
            else{
                res.json(updatedThought)
            }
        })
        .catch(err => res.json(err));
    }
}

module.exports = thoughtController;