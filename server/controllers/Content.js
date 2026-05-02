const models = require('../models');
const Content = models.Content;
const Account = models.Account;

const makeContent = async (req, res) => {

    //expects a title, description, thumbnail, and file for download
    if (!req.body.title || !req.body.description) {
        return res.status(400).json({ error: 'Title and description are required!' });
    }

    if (!req.files?.thumbnail?.[0] || !req.files?.file?.[0]) {
        return res.status(400).json({ error: 'Thumbnail and file are required!' });
    }

    const thumbnailFile = req.files?.thumbnail?.[0] || null;
    const mainFile = req.files?.file?.[0] || null;
    const tagValue = req.body.tag || 'other';

    const contentData = {
        title: req.body.title,
        description: req.body.description,
        tag: req.body.tag,
        owner: req.session.account._id,
        thumbnail: thumbnailFile
            ? {
                data: thumbnailFile.buffer,
                contentType: thumbnailFile.mimetype,
            }
            : undefined,
        file: mainFile
            ? {
                data: mainFile.buffer,
                contentType: mainFile.mimetype,
            }
            : undefined,
    };

    try {
        const newContent = new Content(contentData);
        await newContent.save();

        await Account.updateOne(
            { _id: req.session.account._id },
            { $inc: { uploadCount: 1 } }
        );

        return res.status(201).json({
            title: newContent.title,
            description: newContent.description,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'An error occurred creating content.' });
    }
};


const getContent = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };
        const docs = await Content.find(query).lean().exec();

        const contents = docs.map((doc) => ({
            _id: doc._id,
            title: doc.title,
            description: doc.description,
            thumbnail: doc.thumbnail?.data
                ? doc.thumbnail.data.toString('base64')
                : null,
            thumbnailType: doc.thumbnail?.contentType || null,

            file: doc.file?.data
                ? doc.file.data.toString('base64')
                : null,
            fileType: doc.file?.contentType || null,
        }));

        return res.json({ contents });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving content!' });
    }
};

const getAllContent = async (req, res) => {
    try {
        const docs = await Content.find().lean();

        const contents = docs.map((doc) => ({
            _id: doc._id,
            title: doc.title,
            description: doc.description,
            thumbnail: doc.thumbnail?.data
                ? doc.thumbnail.data.toString('base64')
                : null,
            thumbnailType: doc.thumbnail?.contentType || null,

            file: doc.file?.data
                ? doc.file.data.toString('base64')
                : null,
            fileType: doc.file?.contentType || null,
        }));

        return res.json({ contents });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving content!' });
    }
};
    
module.exports = {
    makeContent,
    getContent,
    getAllContent
}