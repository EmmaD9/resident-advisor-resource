const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const App = () => {
    const [page, setPage] = useState("profile");
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            {page === "profile" && (
                <Profile />
            )}

            {page === "maker" && (
                <div>
                    <div id="makeDomo">
                        <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
                    </div>
                    <div id="domos">
                        <DomoList domos={[]} reloadDomos={reloadDomos} />
                    </div>
                </div>
            )}
        </div>
    );
};

const Profile = () => {
    const [account, setAccount] = React.useState(null);
    const [showNameModal, setShowNameModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const [newName, setNewName] = React.useState("");

    React.useEffect(() =>{
        const loadAccount = async () => {
            const response = await fetch('/getAccount');
            const data = await response.json();
            setAccount(data);
        };

        loadAccount();
    }, []);

    if(!account){
        return (
            <a href="/logout" class="button is-success is-fullwidth mt-4">
                                            no account found
                                        </a>
        )
    }

    const updateName = async (e) => {
        e.preventDefault();

        const response = await fetch('/updateDisplayName', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newName }),
        });

        const result = await response.json();

        if (result.error) {
            console.error(result.error);
            return;
        }

        // Refresh account info
        setAccount((prev) => ({ ...prev, displayName: newName }));

        // Close modal
        setShowNameModal(false);
    };

    return (
        <div>
            <div className="columns">
                <aside className="column is-2 menu section">
                    <p className="menu-label">Navigation</p>
                    <ul className="menu-list">
                        <li><a className="is-active">Profile</a></li>
                        <li><a >Dashboard</a></li>
                        <li><a >Upload</a></li>
                        <li><a >About</a></li>
                    </ul>
                </aside>

                <main className="column section">
                    <h1 className="title">Profile</h1>

                    <section className="section">
                        <div className="container">
                            <div className="columns">
                                <aside className="column is-3">
                                    <div className="box has-text-centered">

                                        
                                        <figure className="image is-128x128 is-inline-block">
                                            <img className="is-rounded" src="https://bulma.io/assets/images/placeholders/128x128.png" />
                                        </figure>

                                        
                                        <h2 className="title is-4 mt-3">{account.username}</h2>
                                        <p className="subtitle is-6">{account.school}</p>

                                        <p>Member Since: {new Date(account.createdDate).toLocaleDateString()}</p>
                                        <p>Uploads: {account.uploads}</p>

                                        <button
                                            className="button is-link is-fullwidth mt-3"
                                            onClick={() => setShowNameModal(true)}
                                        >
                                            Change Display Name
                                        </button>

                                        <button
                                            className="button is-danger is-fullwidth mt-2"
                                            onClick={() => setShowPasswordModal(true)}
                                        >
                                            Change Password
                                        </button>

                                        <a href="/logout" className="button is-success is-fullwidth mt-4">
                                            Log Out
                                        </a>
                                        
                                    </div>

                                    
                                </aside>

                                <p>user's content</p>
                                <main className="column is-9">
                                    <div className="columns is-multiline">

                                    </div>
                                </main>

                            </div>
                        </div>
                    </section>

                </main>
            </div>

            <div className={`modal ${showNameModal ? "is-active" : ""}`}>
                <div className="modal-background" onClick={() => setShowNameModal(false)}></div>

                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Change Display Name</p>
                        <button className="delete" onClick={() => setShowNameModal(false)}></button>
                    </header>

                    <section className="modal-card-body">
                        <form onSubmit={updateName}>
                            <input
                                className="input"
                                type="text"
                                placeholder="New display name"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </form>
                    </section>

                    <footer className="modal-card-foot">
                        <button className="button is-link" onClick={updateName}>Save</button>
                        <button className="button" onClick={() => setShowNameModal(false)}>Cancel</button>
                    </footer>
                </div>
            </div>
        </div>

        
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<Profile />);
};

window.onload = init;