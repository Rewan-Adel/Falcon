exports.serverErrorMessage = (error) =>{
    return res.status(500).json({
        status: "error",
        code: 500,
        message: "Internal Server Error!",
        error: error
    });
};

exports.notFoundErrorMessage = (error) =>{
    return res.status(500).json({
        status: "fail",
        code: 404,
        message: "Not Found!",
        error: error
    });
};