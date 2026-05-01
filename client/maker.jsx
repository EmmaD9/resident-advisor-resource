const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleDomo = (e, onDomoAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const picture = e.target.querySelector('#domoPic').files[0];

    if (!name || !age || !picture) {
        helper.handleError('All fields are required');
        return false;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('picture', picture);

    helper.sendPost(e.target.action, formData, onDomoAdded, true);
    return false;
};

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
            encType="multipart/form-data"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />

            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />

            <label htmlFor="picture">Picture (PNG): </label>
            <input id="domoPic" type="file" name="picture" accept="image/png" />
            

            <label htmlFor="file">File (PDF): </label>
            <input id="domoFile" type="file" name="file" accept="application/pdf" />

            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if (domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        //convert picture (if it exists)
        const imgSrc = domo.picture
            ? `data:image/png;base64,${domo.picture}`
            : "/assets/img/domoface.jpeg";

        return (
            
            <div key={domo.id} className="domo">
                <img
                    src={imgSrc}
                    alt="domo face"
                    className="domoFace"
                />
                <button
                    onClick={() => {
                        if (!domo.picture) return;

                        const link = document.createElement('a');
                        link.href = `data:image/png;base64,${domo.picture}`;
                        link.download = `${domo.name}.png`;   // filename
                        link.click();
                    }}
                >
                    Download Picture
                </button>
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

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
                                            <img className="is-rounded" src="/assets/img/profile.png"/>
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