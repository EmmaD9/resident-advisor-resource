const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const ContentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        set: setName,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    owner:{
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Account',
    },
    thumbnail: {
        // raw PNG bytes
        data: Buffer,
        // e.g., 'image/png'
        contentType: String,
    },
    file: {
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

ContentSchema.statics.toAPI = (doc) => ({
    name: doc.name,
    age: doc.age,
    picture: doc.picture?.data?.toString('base64'),
});

const ContentModel = mongoose.model('Content', ContentSchema);
module.exports = ContentModel;