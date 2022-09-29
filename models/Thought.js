const {Schema, model, Types} = require('mongoose');
const dateFormat = require('../utils/dateFormat');

const ReactionSchema = new Schema({
        reactionId:{
            type:Schema.Types.ObjectId,
            default:() => new Types.ObjectId()
        },
        reactionBody:{
            type:String,
            required:true,
            max:[280, 'Reactions must be 280 characters or less']
        },
        username:{
            type:String,
            required:true
        },
        createdAt:{
            type:Date,
            default:Date.now,
            get:(createdAtVal) => dateFormat(createdAtVal)
        }
    },
    {
        toJSON:{
            getters:true
        }
    }
)

const ThoughtSchema = new Schema({
        thoughtText:{
            type:String,
            required:true,
            min:[1, 'Thoughts cannot be blank.'],
            max:[280, 'Thoughts must be 280 characters or less.'],
        },
        createdAt:{
            type:Date,
            default:Date.now,
            get:(createdAtVal) => dateFormat(createdAtVal)
        },
        username:{
            type:String,
            required:true
        },
        reactions:[ReactionSchema]
    },
    {
        toJSON:{
            virtuals:true,
            getters:true
        }
    }
);

ThoughtSchema.virtual('reactionCount').get(function(){
    return this.reactions.length
});

const Thought = model('Thought',ThoughtSchema);

module.exports = Thought;