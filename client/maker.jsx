const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const TAG_OPTIONS = [
    { value: "doordec", label: "Door Dec", color: "is-primary" },
    { value: "bulletin", label: "Bulletin", color: "is-warning" },
    { value: "newsletter", label: "Newsletter", color: "is-info" },
    { value: "event", label: "Event", color: "is-light" },
    { value: "other", label: "Other", color: "is-dark" },
];


const App = () => {
    const [page, setPage] = useState("profile");
    const [reloadContent, setReloadContent] = useState(false);

    return (
        <div>
            {page === "profile" && <Profile setPage={setPage} />}
            {page === "dashboard" && <Dashboard setPage={setPage} />}
            {page === "upload" && <Upload setPage={setPage} />}
            {page === "about" && <About setPage={setPage} />}
        </div>

    );
};

const ContentList = ({ reloadContent }) => {
    const [contents, setContents] = React.useState([]);

    React.useEffect(() => {
        const loadContentFromServer = async () => {
            const response = await fetch('/getContent');
            const data = await response.json();
            console.log("DATA FROM SERVER:", data);
            setContents(data.contents || []);
        };

        loadContentFromServer();
    }, [reloadContent]);

    if (contents.length === 0) {
        return (
            <div className="contentList">
                <h3 className="emptyContent">No Content Yet!</h3>
            </div>
        );
    }

    const contentNodes = contents.map((item) => {
        console.log("ITEM TAG:", item.tag);

        const tagInfo = TAG_OPTIONS.find(
            t => t.value === item.tag?.toLowerCase()
        );

        const thumbnailSrc = item.thumbnail
            ? `data:${item.thumbnailType};base64,${item.thumbnail}`
            : "/assets/img/defaultThumbnail.png";

        return (
            <div key={item._id} className="contentCard box">
                <img
                    src={thumbnailSrc}
                    alt="thumbnail"
                    className="contentThumbnail"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />

                {tagInfo && (
                    <span className={`tag ${tagInfo.color} mt-2`}>
                        {tagInfo.label}
                    </span>
                )}

                <h3 className="title is-4 mt-3">{item.title}</h3>
                <p className="subtitle is-6">{item.description}</p>

                <button
                    className="button is-info mt-2"
                    onClick={() => {
                        if (!item.file) return;

                        const link = document.createElement('a');
                        link.href = `data:${item.fileType};base64,${item.file}`;
                        link.download = `${item.title}`;
                        link.click();
                    }}
                >
                    Download File
                </button>
            </div>
        );
    });

    return <div className="contentList columns is-multiline">{contentNodes}</div>;
};

const ContentListAll = ({ reloadContent }) => {
    const [contents, setContents] = React.useState([]);

    React.useEffect(() => {
        const loadContentFromServer = async () => {
            const response = await fetch('/getAllContent');
            const data = await response.json();
            //debugging:
            console.log("DATA FROM SERVER:", data);
            setContents(data.contents || []);
        };

        loadContentFromServer();
    }, [reloadContent]);

    if (contents.length === 0) {
        return (
            <div className="contentListAll">
                <h3 className="emptyContent">No Content Yet!</h3>
            </div>
        );
    }

    const contentNodes = contents.map((item) => {
        
        const thumbnailSrc = item.thumbnail
            ? `data:${item.thumbnailType};base64,${item.thumbnail}`
            : "/assets/img/defaultThumbnail.png";
        const tagInfo = TAG_OPTIONS.find(t => t.value === item.tag);

        return (
            <div key={item._id} className="contentCard box">
                <img
                    src={thumbnailSrc}
                    alt="thumbnail"
                    className="contentThumbnail"
                    style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />

                <h3 className="title is-4 mt-3">{item.title}</h3>
                <p className="subtitle is-6">{item.description}</p>

                {tagInfo && (
                    <span className={`tag ${tagInfo.color} mt-2`}>
                        {tagInfo.label}
                    </span>
                )}

                <button
                    className="button is-info mt-2"
                    onClick={() => {
                        if (!item.file) return;

                        const link = document.createElement('a');
                        link.href = `data:${item.fileType};base64,${item.file}`;
                        link.download = `${item.title}`;
                        link.click();
                    }}
                >
                    Download File
                </button>
            </div>
        );
    });

    return <div className="contentList columns is-multiline">{contentNodes}</div>;
};

const Profile = ({ setPage, reloadContent }) => {
    const [account, setAccount] = React.useState(null);

    //changing username
    const [newName, setNewName] = React.useState("");
    const [showNameModal, setShowNameModal] = React.useState(false);

    //changing password
    const [oldPass, setOldPass] = React.useState("");
    const [newPass, setNewPass] = React.useState("");
    const [showPasswordModal, setShowPasswordModal] = React.useState(false);


    React.useEffect(() => {
        const loadAccount = async () => {
            const response = await fetch('/getAccount');
            const data = await response.json();
            setAccount(data);
        };

        loadAccount();
    }, []);

    if (!account) {
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

    const changePassword = async (e) => {
        e.preventDefault();

        const response = await fetch('/updatePassword', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPass, newPass }),
        });

        const result = await response.json();

        if (result.error) {
            console.error(result.error);
            return;
        }

        setOldPass("");
        setNewPass("");

        setShowPasswordModal(false);
        console.log("Profile loaded with setPage:", setPage);
    };

    return (
        <div>
            <div className="columns">
                <aside className="column is-2 menu section">
                    <p className="menu-label">Navigation</p>
                    <ul className="menu-list">
                        <li><a onClick={() => setPage("profile")} className="is-active">Profile</a></li>
                        <li><a onClick={() => setPage("dashboard")}>Dashboard</a></li>
                        <li><a onClick={() => setPage("upload")}>Upload</a></li>
                        <li><a onClick={() => setPage("about")}>About</a></li>
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
                                            <img className="is-rounded" src="assets/img/address-book-solid-full.svg" />
                                        </figure>


                                        <h2 className="title is-4 mt-3">{account.displayName}</h2>
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


                                <main className="column is-9">
                                    <div className="columns is-multiline">
                                        <ContentList content={[]} reloadContent={reloadContent} />
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

            <div className={`modal ${showPasswordModal ? "is-active" : ""}`}>
                <div className="modal-background" onClick={() => setShowPasswordModal(false)}></div>

                <div className="modal-card">
                    <header className="modal-card-head">
                        <p className="modal-card-title">Change Password</p>
                        <button className="delete" onClick={() => setShowPasswordModal(false)}></button>
                    </header>

                    <section className="modal-card-body">
                        <form onSubmit={changePassword}>
                            <input
                                className="input mb-3"
                                type="password"
                                placeholder="Current password"
                                value={oldPass}
                                onChange={(e) => setOldPass(e.target.value)}
                            />

                            <input
                                className="input"
                                type="password"
                                placeholder="New password"
                                value={newPass}
                                onChange={(e) => setNewPass(e.target.value)}
                            />
                        </form>
                    </section>

                    <footer className="modal-card-foot">
                        <button className="button is-link" onClick={changePassword}>Save</button>
                        <button className="button" onClick={() => setShowPasswordModal(false)}>Cancel</button>
                    </footer>
                </div>
            </div>
        </div>


    );
};

const Dashboard = ({ setPage, reloadContent }) => {
    return (
        <div>
            <div className="columns">
                <aside className="column is-2 menu section">
                    <p className="menu-label">Navigation</p>
                    <ul className="menu-list">
                        <li><a onClick={() => setPage("profile")}>Profile</a></li>
                        <li><a onClick={() => setPage("dashboard")} className="is-active">Dashboard</a></li>
                        <li><a onClick={() => setPage("upload")}>Upload</a></li>
                        <li><a onClick={() => setPage("about")}>About</a></li>
                    </ul>
                </aside>
            </div>
            <main className="column is-9">
                <div className="columns is-multiline">
                    <ContentListAll content={[]} reloadContent={reloadContent} />
                </div>
            </main>
        </div>
    );
};

const Upload = ({ setPage }) => {
    const [error, setError] = React.useState(null);
    const [tag, setTag] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const result = await fetch('/content', {
            method: 'POST',
            body: formData,
        }).then(res => res.json());

        if (result?.error) {
            setError({ code: result.status, message: result.error });
            return;
        }

        window.location.href = '/app';
    };

    return (
        <div>
            <div className="columns">
                {/* Sidebar */}
                <aside className="column is-2 menu section">
                    <p className="menu-label">Navigation</p>
                    <ul className="menu-list">
                        <li><a onClick={() => setPage("profile")}>Profile</a></li>
                        <li><a onClick={() => setPage("dashboard")}>Dashboard</a></li>
                        <li><a onClick={() => setPage("upload")} className="is-active">Upload</a></li>
                        <li><a onClick={() => setPage("about")}>About</a></li>
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="column section">
                    <div className="container">

                        <form onSubmit={handleUpload}>

                            {/* title header */}
                            <div className="card p-5">
                                <h1 className="title has-text-centered">Upload a File</h1>
                            </div>

                            {/* thumbnail, title, description */}
                            <div className="columns is-variable is-6 mt-5">

                                {/* thumbnail */}
                                <div className="column is-one-third">
                                    <div className="box has-text-centered" style={{ height: "220px" }}>
                                        <span className="icon is-large">
                                            <i className="fas fa-image fa-3x"></i>
                                        </span>
                                        <p className="mt-3">Add a thumbnail!</p>

                                        <input
                                            className="file-input mt-3"
                                            type="file"
                                            name="thumbnail"
                                            accept="image/png"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* title and description */}
                                <div className="column">
                                    <div className="field">
                                        <label className="label">Title</label>
                                        <div className="control">
                                            <input
                                                className="input"
                                                type="text"
                                                name="title"
                                                placeholder="Enter a title"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="field mt-4">
                                        <label className="label">Description</label>
                                        <div className="control">
                                            <textarea
                                                className="textarea"
                                                name="description"
                                                placeholder="Write a description"
                                                required
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* bottom row */}
                            <div className="columns is-vcentered mt-5">
                                <div className="column is-one-third">
                                    <div className="file has-name is-info">
                                        <label className="file-label">
                                            <input
                                                className="file-input"
                                                type="file"
                                                name="file"
                                                accept="image/png,application/pdf"
                                                required
                                            />
                                            <span className="file-cta">
                                                <span className="file-icon">
                                                    <i className="fas fa-cloud-upload-alt"></i>
                                                </span>
                                                <span className="file-label">Select a File</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                <div
                                    className="column"
                                    style={{
                                        position: "relative",
                                        zIndex: 10,
                                        background: "white"
                                    }}
                                >
                                    <label className="label">Tag</label>

                                    <div className="tags">
                                        {TAG_OPTIONS.map((t) => (
                                            <span
                                                key={t.value}
                                                className={`tag ${t.color} ${tag === t.value ? "is-selected" : ""}`}
                                                style={{ cursor: "pointer" }}
                                                onClick={() => {
                                                    console.log("tag clicked");
                                                    setTag(t.value);
                                                }}
                                            >
                                                {t.label}
                                            </span>
                                        ))}
                                    </div>
                                    <input type="hidden" name="tag" value={tag} />
                                    <p>Selected tag: {tag || "none"}</p>
                                </div>


                                <div className="column">
                                    <button className="button is-success is-fullwidth" type="submit">
                                        Submit
                                    </button>
                                </div>
                            </div>

                        </form>

                    </div>
                </main>
            </div>
        </div>
    );
};


const About = ({ setPage }) => {
    return (
        <div>
            <div className="columns">
                <aside className="column is-2 menu section">
                    <p className="menu-label">Navigation</p>
                    <ul className="menu-list">
                        <li><a onClick={() => setPage("profile")}>Profile</a></li>
                        <li><a onClick={() => setPage("dashboard")} >Dashboard</a></li>
                        <li><a onClick={() => setPage("upload")}>Upload</a></li>
                        <li><a onClick={() => setPage("about")} className="is-active">About</a></li>
                    </ul>
                </aside>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;