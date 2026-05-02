const controllers = require('./controllers');
const mid = require('./middleware');
const upload = require('./middleware/upload');

const router = (app) => {
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/app', mid.requiresLogin, controllers.Account.appPage);

    app.get('/getAccount', controllers.Account.getAccount);
    app.get('/', (req, res) => {
        if (req.session.account) {
            return res.redirect('/app');
        }
        return res.render('login');
    });
    app.post('/updateDisplayName', controllers.Account.changeDisplayName);
    app.post('/updatePassword', controllers.Account.changePassword);
    app.post(
        '/content',
        mid.requiresLogin,
        upload.fields([
            { name: 'thumbnail', maxCount: 1 },
            { name: 'file', maxCount: 1 },
        ]),
        controllers.Content.makeContent
    );

    app.get('/getContent', controllers.Content.getContent);
    app.get('/getAllContent', controllers.Content.getAllContent);
};

module.exports = router;
