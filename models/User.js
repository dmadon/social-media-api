const {Schema, model} = require('mongoose');

var validateEmail = function(email) {
    var regex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
    return regex.test(email)
};

const UserSchema = new Schema({
        username:{
            type:String,
            unique:true,
            required:'Username is required',
            trim:true,
        },
        email:{
            type:String,
            unique:true,
            required:'A valid email address is required.',
            trim: true,
            match:[/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/, 'This is not a valid email address. Please try again.'],
            validate:[validateEmail, 'Email validation failed. Please check your email address and try again.']
        },
        thoughts:[
            {
                type:Schema.Types.ObjectId,
                ref:'Thought'
            }
        ],
        friends:[
            {
                type:Schema.Types.ObjectId,
                ref:'User'
            }
        ]
    },
    {
        toJSON:{
            virtuals:true,
            getters:true
        }
    }
)

// create a virtual called 'friendCount' that retrieves the length of the user's friends array field on query.
UserSchema.virtual('friendCount').get(function(){
    return this.friends.length
});

// create the User model using the UserSchema
const User = model('User',UserSchema);

// export the User model
module.exports = User;