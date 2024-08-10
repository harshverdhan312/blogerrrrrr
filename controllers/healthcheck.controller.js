const { ApiError } = require("../utils/ApiError");
const { ApiResponse } = require("../utils/ApiResponse");
const { asyncHandler } = require("../utils/asyncHandler");

const healthcheck = asyncHandler(async (req, res) => {
    try {
        return res
            .status(200)
            .json(
            new ApiResponse(
                200, "Everything is OK"
            )
        )
    } catch (error) {
        throw new ApiError(500, "Internal Error")
    }
});

module.exports = {
    healthcheck,
};
