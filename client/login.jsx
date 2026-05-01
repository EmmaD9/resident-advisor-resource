const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch('/login', {
        method: 'POST',
        body: new URLSearchParams(new FormData(e.target)),
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const data = await response.json();

    if (data.redirect) {
        window.location = data.redirect;
    }
};

const handleSignup = (e) => {
    e.preventDefault();
    
    const formData = new URLSearchParams(new FormData(e.target));

    const username = formData.get('username');
    const pass = formData.get('pass');
    const pass2 = formData.get('pass2');
    const displayName = formData.get('displayName');
    const school = formData.get('school');

    if (!username || !pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if (pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost('/signup', formData);

    helper.sendPost('/signup', formData);

    return false;
}

const LoginWindow = () => {
    return (
        <form id="loginForm" onSubmit={handleLogin}>
            <div className="field">
                <label className="label">Username</label>
                <div className="control">
                    <input className="input" type="text" name="username" placeholder="Username" required />
                </div>
            </div>

            <div className="field">
                <label className="label">Password</label>
                <div className="control">
                    <input className="input" type="password" name="pass" placeholder="Password" required />
                </div>
            </div>

            <div className="field">
                <button className="button is-success is-fullwidth" type="submit">Login</button>
            </div>
        </form>
    );
};

const SignupWindow = () => {
    return (
        <form id="signupForm" onSubmit={handleSignup}>
            <div className="field">
                <label className="label">Username</label>
                <div className="control">
                    <input className="input" type="text" name="username" placeholder="Username" required />
                </div>
            </div>

            <div className="field">
                <label className="label">Password</label>
                <div className="control">
                    <input className="input" type="password" name="pass" placeholder="Password" required />
                </div>
            </div>

            <div className="field">
                <label className="label">Re-Enter Password</label>
                <div className="control">
                    <input className="input" type="password" name="pass2" required />
                </div>
            </div>

            <div className="field">
                <label className="label">Display Name</label>
                <div className="control">
                    <input className="input" type="text" name="displayName" />
                </div>
            </div>

            <div className="field">
                <label className="label">School (optional)</label>
                <div className="control">
                    <input className="input" type="text" name="school" />
                </div>
            </div>

            <div className="field">
                <button className="button is-success is-fullwidth" type="submit">Sign Up</button>
            </div>
        </form>
    );
};

const showLogin = () => {
    document.getElementById('loginRoot').style.display = 'block';
    document.getElementById('signupRoot').style.display = 'none';
};

const showSignup = () => {
    document.getElementById('loginRoot').style.display = 'none';
    document.getElementById('signupRoot').style.display = 'block';
};

const init = () => {
    const loginRoot = document.getElementById('loginRoot');

    if (loginRoot) {
        createRoot(loginRoot).render(<LoginWindow />);
    }

    const signupRoot = document.getElementById('signupRoot');

    if (signupRoot) {
        createRoot(signupRoot).render(<SignupWindow />);
    }

    // Default: hide both
    loginRoot.style.display = 'none';
    signupRoot.style.display = 'none';

    // Attach navbar buttons
    document.getElementById('loginNav')?.addEventListener('click', showLogin);
    document.getElementById('signupNav')?.addEventListener('click', showSignup);
};

window.onload = init;