import mongoose from "mongoose";

const threadSchema = new mongoose.Schema({
    text: {type: String, required: true},
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    parentId:{
        type: String
    },
    children:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
    }
    ],
    likesCount:{
        type: Number,
        default: 0
    },

})

const Thread = mongoose.models.Thread || mongoose.model('Thread', threadSchema)

export default Thread


//Look why export default thread works with a different name and the file name thread.model.ts it has different name
