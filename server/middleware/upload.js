const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'image/png') {
            return cb(new Error('Only PNG files are allowed'));
        }
        cb(null, true);
    }
});

module.exports = upload;