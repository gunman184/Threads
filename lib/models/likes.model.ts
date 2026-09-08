import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread',
        required: true
    },

})

likeSchema.index(
    { user: 1, thread: 1 },
    { unique: true }
);

const Like = mongoose.models.Like || mongoose.model("Like", likeSchema);

export default Like;

