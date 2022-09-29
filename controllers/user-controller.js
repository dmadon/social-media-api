const {User, Thought} = require('../models');

const userController = {
    // get all users
    getAllUsers(req,res){
        User.find({})
            .populate(
                {
                    path:'thoughts',
                    select:'-__v'
                }               
            )
            .populate(
                {
                    path:'friends',
                    select:'-__v'
                }
            )
            .select('-__v')
            .sort({username:1})
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // get one user by id
    getUserById({params},res){
        User.findOne({_id:params.id})
            .populate(
                {
                    path:'thoughts',
                    select:'-__v'
                }               
            )
            .populate(
                {
                    path:'friends',
                    select:'-__v'
                }
            )
            .select('-__v')
            .then(dbUserData => {
                if(!dbUserData){
                    res.status(404).json({message:'No user found with that id.'});
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // create a new user
    createUser({body},res){
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(err => res.status(400).json(err));
    },

    // update user data
    updateUser({params,body},res){
        User.findOneAndUpdate({_id:params.id},body,{new:true,runValidators:true})
        .then(dbUserData => {
            if(!dbUserData){
                res.status(404).json({message:'No user found with that id.'});
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => res.status(400).json(err));
    },

    // delete a user and it's associated thoughts
    deleteUser({params},res){
        User.findOneAndDelete({_id:params.id})
        .then(deletedUser => {
            if(!deletedUser){
                res.status(404).json({message:'No user found with that id.'});
                return;
            }
            else{
                for(var i = 0; i<deletedUser.thoughts.length; i++){
                    Thought.findOneAndDelete(
                        {_id:deletedUser.thoughts[i]._id},
                        function(err,thought){
                            if(err){
                                console.log(err);                               
                            }
                            else{
                                console.log(`deleted thought ${thought._id}`);
                            }                            
                        }
                    );
                }
                res.json({message:'Successfully deleted user and all associated thoughts'})
                }
            } 
        )
    },

    // add a friend to a user's friends list
    addFriend({params},res){
        // check to make sure the friend id is valid
       User.findOne(
        {_id:params.friendId}
       )
       .then(friend => {
            // if friend's id is not a valid id number, ask user to check it again
            if(!friend){
                res.json({message:"Please double-check your friend's ID."})
            }
            // if friend's id is valid, update the user's friends array with the friend's id number
            else{
                User.findOneAndUpdate(
                    {_id:params.userId},
                    {$addToSet: {friends:params.friendId}},
                    {new:true, runValidators:true}
                )
                .then(updatedUser => {
                    if(!updatedUser){
                        res.status(404).json({message:'No user found with that id.'})
                    }
                    res.json(updatedUser)
                })
                .catch(err => res.status(400).json(err));
            }
       })     
    },

    // delete a friend from a user's friends list
    deleteFriend({params},res){
        // check to make sure the friend id is valid
       User.findOne(
        {_id:params.friendId}
       )
       .then(friend => {
            // if friend's id is not a valid id number, ask user to check it again
            if(!friend){
                res.json({message:"Please double-check your friend's ID."})
            }
            // if friend's id is valid, update the user's friends array to remove  the friend's id number
            else{
                User.findOneAndUpdate(
                    {_id:params.userId},
                    {$pull: {friends:params.friendId}},
                    {new:true, runValidators:true}
                )
                .then(updatedUser => {
                    if(!updatedUser){
                        res.status(404).json({message:'No user found with that id.'})
                    }
                    res.json(updatedUser)
                })
                .catch(err => res.status(400).json(err));
            }
       })     
    }
}

module.exports = userController;