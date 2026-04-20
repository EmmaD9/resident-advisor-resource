const multer = require('multer');

const storage = multer.memoryStorage();
const allowedTypes = ['image/png', 'application/pdf'];

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only PNG or PDF files are allowed'));
        }

        cb(null, true);
    }
});
