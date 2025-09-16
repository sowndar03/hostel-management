const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const XLSX = require("xlsx");
const fs = require("fs");

const AuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, "SECRET_KEY");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

const allowedExtensions = {
    excel: [".xlsx", ".xls"],
    image: [".jpg", ".jpeg", ".png"],
};

const importExcelHandler = (moduleName) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const folder = path.join("uploads", moduleName);
            if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        },
    });

    const upload = multer({ storage });

    return [
        upload.single("file"),
        (req, res, next) => {
            if (!req.file) return res.status(400).json({ message: "No file uploaded" });
            const ext = path.extname(req.file.originalname).toLowerCase();
            if (!allowedExtensions.excel.includes(ext)) {
                return res.status(400).json({ message: "Only Excel files allowed" });
            }
            try {
                const workbook = XLSX.readFile(req.file.path);
                const sheetName = workbook.SheetNames[0];
                const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                req.importMeta = { type: "excel", moduleName };
                req.importedData = data;

                fs.unlinkSync(req.file.path);
                next();
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "File processing error" });
            }
        },
    ];
};

const importImageHandler = (moduleName) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const folder = path.join("uploads", moduleName, file.fieldname);
            if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
            cb(null, folder);
        },
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname));
        },
    });

    const upload = multer({ storage });

    return [
        upload.fields([
            { name: "photo", maxCount: 1 },
            { name: "id_proof", maxCount: 1 },
        ]),
        (req, res, next) => {
            if (!req.files || Object.keys(req.files).length === 0)
                return res.status(400).json({ message: "No files uploaded" });

            req.importedFiles = {};

            ["photo", "id_proof"].forEach((field) => {
                if (req.files[field]) {
                    const file = req.files[field][0];
                    const ext = path.extname(file.originalname).toLowerCase();
                    if (!allowedExtensions.image.includes(ext))
                        return res.status(400).json({ message: `Only images allowed for ${field}` });

                    req.importedFiles[field] = file;
                }
            });

            next();
        },
    ];
};



module.exports = {
    AuthMiddleware,
    importExcelHandler,
    importImageHandler
};
