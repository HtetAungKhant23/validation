const getTokenFromHeader = (req) => {
    const headerObj = req.headers;
    return headerObj["authorization"].split(" ")[1];
}

module.exports = getTokenFromHeader;