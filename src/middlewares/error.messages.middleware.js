exports.serverErrorMessage = (error, res) =>{
    return res.status(500).json({
        status: "error",
        code: 500,
        message: "Internal Server Error!",
        error: error.message
    });
};

exports.badRequestMessage = (msg, res) =>{
    return res.status(400).json({
        status: "fail",
        code: 400,
        message: msg || "Bad Request",
    });
};

exports.unAuthorizedMessage = (msg, res) =>{
    return res.status(401).json({
        status : "fail",
        code   : 401,
        message: msg,
    });
};

exports.notFoundError = (msg, res) =>{
    return res.status(404).json({
        status : "fail",
        code   : 404,
        message: msg ,
    });
};

exports.notFoundMessage = (msg, res) =>{
    return res.status(200).json({
        status : "success",
        code   : 200,
        message: msg || "Not found!",
    });
}