const { SuccessResponse } = require("../core/success.response");

const dataProfile = [
    {
        usr_id: 1,
        usr_name: "Bao",
        usr_avt: "image/user/1.jpg"
    },
    {
        usr_id: 2,
        usr_name: "Hoang",
        usr_avt: "image/user/2.jpg"
    },
    {
        usr_id: 3,
        usr_name: "Vu",
        usr_avt: "image/user/3.jpg"
    }
]

class ProfileController {
    profiles = async (req, res, next) => {
        new SuccessResponse({
            message: "View all profiles",
            metadata: dataProfile
        }).send(res);
    }

    profile = async (req, res, next) => {
        new SuccessResponse({
            message: "View profile",
            metadata: {
                usr_id: 4,
                usr_name: "Hai",
                usr_avt: "image/user/4.jpg"
            }
        }).send(res);
    }
}

module.exports = new ProfileController();