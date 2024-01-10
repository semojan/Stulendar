// this function gets the input data for use
function getSessionData(req){
    const sessionData = req.session.inputData;

    req.session.inputData = null;

    return sessionData;
}

// this function stores the data in session
function flashDataToSession (req, data, action) {
    req.session.inputData = data;
    req.session.save(action);
} 

module.exports = {
    getSessionData: getSessionData,
    flashDataToSession: flashDataToSession
};

// in these functions we flash user input data into the session
// so that if the page was refreshed due to any reasons or errors 
// the form data remains