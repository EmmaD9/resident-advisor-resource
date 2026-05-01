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

module.exports = {
    loginPage,
    login,
    logout,
    signup,
};