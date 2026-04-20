/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('domoMessage').classList.remove('hidden');
};

// Rewritten send post for handling files posted
const sendPost = async (url, data, handler) => {
    let options = {
        method: 'POST',
    };

    // If sending FormData (file upload)
    if (data instanceof FormData) {
        options.body = data;
        // DO NOT set Content-Type here
    } else {
        // Normal JSON request
        options.headers = {
            'Content-Type': 'application/json',
        };
        options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    const result = await response.json();

    document.getElementById('domoMessage').classList.add('hidden');

    if (result.redirect) {
        window.location = result.redirect;
    }

    if (result.error) {
        handleError(result.error);
    }

    if (handler) {
        handler(result);
    }
};

const hideError = () => {
    document.getElementById('domoMessage').classList.add('hidden');
};

module.exports = {
    handleError,
    sendPost,
    hideError
};
