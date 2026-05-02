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
    tag: {
        type: String,
        enum: ['doordec', 'bulletin', 'newsletter', 'event', 'other'],
        default: 'other',
        required: true
    }
});

ContentSchema.statics.toAPI = (doc) => ({
    _id: doc._id,
    title: doc.title,
    description: doc.description,
    tag: doc.tag,
    thumbnail: doc.thumbnail?.data
        ? doc.thumbnail.data.toString('base64')
        : null,
    file: doc.file?.data
        ? doc.file.data.toString('base64')
        : null,
    owner: doc.owner?.displayName || doc.owner?.username || "Unknown",
    
});

const ContentModel = mongoose.model('Content', ContentSchema);
module.exports = ContentModel;