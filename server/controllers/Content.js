const models = require('../models');
const Domo = models.Domo;


const makerPage = (req, res) => {
    return res.render('app');
};

const makeDomo = async (req, res) => {
    if (!req.body.name || !req.body.age || !req.file) {
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);
        return res.status(400).json({ error: 'Bothname and age are required!' });
    }

    const domoData = {
        name: req.body.name,
        age: req.body.age,
        picture: {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        },
        owner: req.session.account._id,
    };

    try{
        const newDomo = new Domo(domoData);
        await newDomo.save();
        return res.status(201).json({name: newDomo.name, age: newDomo.age});
    } catch (err){
        console.log(err);
        if(err.code === 11000){
            return res.status(400).json({ error: 'Domo already exists!' });
        }
        return res.status(500).json({ error: 'An error occurred making the Domo.' });

    }
}

const getDomos = async (req, res) => {
    try {
        const query = { owner: req.session.account._id };

        // Get full domo docs including picture
        const docs = await Domo.find(query).lean().exec();

        const domos = docs.map((doc) => ({
            _id: doc._id,
            name: doc.name,
            age: doc.age,
            picture: doc.picture?.data
                ? doc.picture.data.toString('base64')
                : null,
        }));

        return res.json({ domos });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error retrieving domos!' });
    }
};
    
module.exports = {
    makerPage,
    makeDomo,
    getDomos
}