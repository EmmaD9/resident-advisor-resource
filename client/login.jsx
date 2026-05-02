const helper = require('./helper.js');
const React = require('react');
const { createRoot } = require('react-dom/client');

const LoginWindow = () => {
    const [error, setError] = React.useState(null);
    const [username, setUsername] = React.useState("");
    const [pass, setPass] = React.useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const result = await helper.sendPost('/login', { username, pass });

        if (result?.error) {
            setError({ code: result.status, message: result.error });
            return;
        }

        window.location.href = '/app';
    };

    return (
        <div className="box has-background-info-light">

            {error && (
                <div className="notification is-danger">
                    <button className="delete" onClick={() => setError(null)}></button>
                    <strong>Error {error.code}:</strong> {error.message}
                </div>
            )}

            <form id="loginForm" onSubmit={handleLogin}>
                <div className="field">
                    <label className="label">Username</label>
                    <div className="control">
                        <input className="input" type="text" name="username" placeholder="Username" value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required />
                    </div>
                </div>

                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input className="input" type="password" name="pass" placeholder="Password" value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            required />
                    </div>
                </div>

                <div className="field">
                    <button className="button has-background-success-dark has-text-warning is-fullwidth" type="submit">Login</button>
                </div>
            </form>
        </div>
    );
};

const SignupWindow = () => {
    const [error, setError] = React.useState(null);
    const handleSignup = async (e) => {
        e.preventDefault();

        const formData = new URLSearchParams(new FormData(e.target));

        const username = formData.get('username');
        const pass = formData.get('pass');
        const pass2 = formData.get('pass2');
        const displayName = formData.get('displayName');
        const school = formData.get('school');

        if (!username || !pass || !pass2) {
            setError({ code: 400, message: 'All fields are required!' });
            return false;
        }

        if (pass !== pass2) {
            setError({ code: 400, message: 'Passwords do not match!' });
            return false;
        }

        // Send to server
        const result = await helper.sendPost('/signup', formData);

        if (result?.error) {
            setError({ code: result.status, message: result.error });
            return;
        }

        // Success
        window.location.href = '/app';

    }
    return (
        <div className="box has-background-info-light">

            {error && (
                <div className="notification is-danger">
                    <button className="delete" onClick={() => setError(null)}></button>
                    <strong>Error {error.code}:</strong> {error.message}
                </div>
            )}
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
                    <button className="button has-background-success-dark has-text-warning is-fullwidth" type="submit">Sign Up</button>
                </div>
            </form>
        </div>
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
    
    loginRoot.style.display = 'block';
    signupRoot.style.display = 'none';

    // Attach navbar buttons
    document.getElementById('loginNav')?.addEventListener('click', showLogin);
    document.getElementById('signupNav')?.addEventListener('click', showSignup);
};

window.onload = init;