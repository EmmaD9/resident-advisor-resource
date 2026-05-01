const models = require('../models');
const Account = models.Account.AccountModel;

const loginPage = (req, res) => {
    return res.render('login');
};

const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
};

const login = (req, res) => {
    const username = req.body.username;
    const pass = req.body.pass;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    return Account.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password!' });
        }
        req.session.account = Account.toAPI(account);
        return res.json({ redirect: '/maker' });
    });
};

const signup = async (req, res) => {
    const username = req.body.username;
    const pass1 = req.body.pass;
    const pass2 = req.body.pass2;

    const displayName = req.body.displayName;
    const school = req.body.school;

    if (!username || !pass1 || !pass2) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    if (pass1 !== pass2) {
        return res.status(400).json({ error: 'Passwords do not match!' });
    }

    try {
        const hash = await Account.generateHash(pass1);

        const accountData = {
            username,
            password: hash,
        };

        if (displayName) accountData.displayName = displayName;
        if (school) accountData.school = school;

        const newAccount = new Account(accountData);
        await newAccount.save();

        req.session.account = Account.toAPI(newAccount);
        return res.json({ redirect: '/maker' });
    } catch (err) {
        console.log(err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Username already in use!' });
        }
        return res.status(500).json({ error: 'An error occured!' });
    }

};

const changeDisplayName = async (req, res) => {
    if (!req.session.account) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const newName = req.body.displayName;

    if(!newName){
        return res.status(400).json({ error: 'Display name required' });
    }
    try {
        const account = await AccountModel.findById(req.session.account._id);
        account.displayName = newName;
        await account.save();

        req.session.account.displayName = newName;

        return res.json({ message: 'Display name updated', displayName: newName });
    } catch (err) {
        return res.status(500).json({ error: 'Error updating display name' });
    }
};

const changePassword = async (req, res) => {
    if (!req.session.account) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const {oldPass, newPass} = req.body;

    if (!oldPass || !newPass) {
        return res.status(400).json({ error: 'Both passwords required' });
    }

    try {
        const account = await AccountModel.findById(req.session.account._id);
        const match = await AccountModel.authenticate(
            account.username,
            oldPass
        );

        if(!match){
            return res.status(400).json({error: 'old password incorrect'});
        }

        const hash = await AccountModel.generateHash(newPass);
        account.password = hash;
        await account.save();

        return res.json({ message: 'Password updated!!'});
    } catch (err) {
        return res.status(500).json({ error: 'Error updating password' });
    }
};

const getAccount = (req, res) => {
    if (!req.session.account) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    return res.json({
        username: req.session.account.username,
        displayName: req.session.account.displayName,
        school: req.session.account.school,
        createdDate: req.session.account.createdDate,
        uploads: req.session.account.uploads,
    });
};

module.exports = {
    loginPage,
    login,
    logout,
    signup,
    getAccount,
    changePassword,
    changeDisplayName
};