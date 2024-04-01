exports.serverErrorMessage = (error) =>{
    return res.status(500).json({
        status: "error",
        code: 500,
        message: "Internal Server Error!",
        error: error
    });
};

exports.notFoundErrorMessage = (msg) =>{
    return res.status(404).json({
        status: "fail",
        code: 404,
        message: msg || "Not Found!",
    });
};

exports.badRequestMessage = (msg) =>{
    return res.status(400).json({
        status: "fail",
        code: 400,
        message: msg || "Bad Request",
    });
};