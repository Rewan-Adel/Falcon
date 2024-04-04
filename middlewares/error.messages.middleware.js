exports.serverErrorMessage = (error, res) =>{
    return res.status(500).json({
        status: "error",
        code: 500,
        message: "Internal Server Error!",
        error: error.message
    });
};

exports.notFoundErrorMessage = (msg, res) =>{
    return res.status(404).json({
        status: "fail",
        code: 404,
        message: msg ,
    });
};

exports.badRequestMessage = (msg, res) =>{
    return res.status(400).json({
        status: "fail",
        code: 400,
        message: msg || "Bad Request",
    });
};