const {User, Thought} = require('../models');

const thoughtController = {

    // addThought({params,body},res){
    //     Thought.create(body)
    //         .then(({_id}) => {
    //             User.findOneAndUpdate(
    //                 {_id:params.userId},
    //                 {$addToSet: {thoughts:_id}},
    //                 {new:true,runValidators:true}
    //             )
    //         })
    //         .then(dbUserData => {
    //             if(!dbUserData){
    //                 res.status(404).json({message:'No user found with that id.'});
    //                 return;
    //             }
    //             res.json(dbUserData);
    //         })
    //         .catch(err => res.json(err));
    // },

    addThought({params,body},res){
        User.findOne({_id:params.userId})
            .then(dbUserMatch => {
                if(!dbUserMatch){
                    res.status(404).json({message:'No user found with that id.'});
                    return
                }
                
                Thought.create({username:dbUserMatch.username, thoughtText:body.thoughtText})
                    .then(newThought => {
                        return User.findOneAndUpdate(
                            {username:newThought.username},
                            {$addToSet: {thoughts:newThought._id}},
                            {new:true,runValidators:true}
                        )
                    })                                
                    .then(dbUserData => {
                        if(!dbUserData){
                            res.status(404).json({message:'No user found with that id.'});
                            return
                        }
                        res.json(dbUserData)
                    })
                    .catch(err => res.json(err));
            })

    },

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

    getAllThoughts(req,res){
        Thought.find({})
            .then(dbThoughtData => {
                res.json(dbThoughtData)
            })
            .catch(err => res.json(err));

    },

    deleteAllThoughts(req,res){
        Thought.deleteMany({})
            .then(deletedThoughts => {
                if(!deletedThoughts){
                    res.json({message:'um...nothing happened.'})
                }
                res.json(true)
            })
            .catch(err => res.json(err));               
    }


}

module.exports = thoughtController;