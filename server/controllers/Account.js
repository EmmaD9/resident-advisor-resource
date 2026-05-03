const models = require('../models');
const Account = models.Account.AccountModel;

const loginPage = (req, res) => {
    return res.render('login');
};

const appPage = (req, res) => {
    return res.render('app');
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
        return res.json({ redirect: '/app' });
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
        return res.json({ redirect: '/app' });
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

    const newName = req.body.newName;

    if(!newName){
        return res.status(400).json({ error: 'Display name required' });
    }
    try {
        const account = await Account.findById(req.session.account._id);
        account.displayName = newName;
        await account.save();

        req.session.account.displayName = newName;

        return res.json({ message: 'Display name updated', displayName: newName });
    } catch (err) {
        console.error("Display name update failed:", err);
        return res.status(500).json({ error: 'Error updating display name' });
    }
};

const togglePremium = async (req, res) => {
    if (!req.session.account) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    try {
        const account = await Account.findById(req.session.account._id);

        if (!account) {
            return res.status(404).json({ error: 'Account not found' });
        }

        //change bool
        account.isPro = !account.isPro;
        await account.save();

        //update current session
        req.session.account.isPro = account.isPro;

        return res.json({
            message: 'Premium status updated',
            isPro: account.isPro,
        });

    } catch (err) {
        console.error("Status update failed:", err);
        return res.status(500).json({ error: 'Error updating premium status' });
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
        const account = await Account.findById(req.session.account._id);
        const match = await new Promise((resolve) => {
            Account.authenticate(account.username, oldPass, (err, doc) => {
                if (err || !doc) return resolve(false);
                resolve(true);
            });
        });

        if(!match){
            return res.status(400).json({error: 'old password incorrect'});
        }

        const hash = await Account.generateHash(newPass);
        account.password = hash;
        await account.save();

        return res.json({ message: 'Password updated!!'});
    } catch (err) {
        console.error("Password update failed:", err);
        return res.status(500).json({ error: 'Error updating password' });
    }
};

const getAccount = async (req, res) => {
    if (!req.session.account) {
        return res.status(401).json({ error: 'Not logged in' });
    }

    const account = await Account.findById(req.session.account._id).lean();

    return res.json({
        username: account.username,
        displayName: account.displayName,
        school: account.school,
        createdDate: account.createdDate,
        uploads: account.uploads || 0,
    });
};

module.exports = {
    loginPage,
    login,
    logout,
    signup,
    getAccount,
    changePassword,
    changeDisplayName,
    appPage,
    togglePremium
};