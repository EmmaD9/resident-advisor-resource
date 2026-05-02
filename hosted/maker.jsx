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
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;