const models = require('../models');
const Content = models.Content;

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

    const contentData = {
        title: req.body.title,
        description: req.body.description,
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
                ? `data:${doc.thumbnail.contentType};base64,${doc.thumbnail.data.toString('base64')}`
                : null,
            file: doc.file?.data
                ? `data:${doc.file.contentType};base64,${doc.file.data.toString('base64')}`
                : null,
        }));

        return res.json({ contents });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving content!' });
    }
};
    
module.exports = {
    makeContent,
    getContent
}