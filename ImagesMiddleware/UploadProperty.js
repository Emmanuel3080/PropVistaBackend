const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")

const cloudinary = require("../CloudinarySetUp/cloudinary")

const storage = new CloudinaryStorage({
    cloudinary, cloudinary,
    params: {
        folder: "PropoertyImage",
        allowedFormat: ["jpg", "png", "gif", "jpeg"],
        transformation: [{ width: 500, height: 500 }],
    },
})





const uploadPropertyImg = multer({ storage });
module.exports = uploadPropertyImg;