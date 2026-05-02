const controllers = require('./controllers');
const mid = require('./middleware');
//const upload = require('./middleware/upload');

const router = (app) => {
    app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

    app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

    app.get('/logout', mid.requiresLogin, controllers.Account.logout);

    app.get('/app', mid.requiresLogin, controllers.Account.appPage);
    //app.post('/maker', mid.requiresLogin, upload.single('picture'), controllers.Domo.makeDomo);

    app.get('/getAccount', controllers.Account.getAccount);
    app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
    app.post('/updateDisplayName', controllers.Account.changeDisplayName);
    app.post('/updatePassword', controllers.Account.changePassword);
};

module.exports = router;
