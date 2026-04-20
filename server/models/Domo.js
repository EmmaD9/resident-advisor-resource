const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const DomoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    age: {
        type: Number,
         min:0,
         required: true,
    },
    owner:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    picture: {
        // raw PNG bytes
        data: Buffer,
        // e.g., 'image/png'
        contentType: String,
    },
    createdDate:{
        type: Date,
        default: Date.now,
    },
});

DomoSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    age: doc.age,
    picture: doc.picture?.data?.toString('base64'),
});

const DomoModel = mongoose.model('Domo', DomoSchema);
module.exports = DomoModel;