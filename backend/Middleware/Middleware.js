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

const importHandler = (type, moduleName) => {
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

            if (type === "excel" && !allowedExtensions.excel.includes(ext)) {
                return res.status(400).json({ message: "Only Excel files (.xlsx, .xls) are allowed" });
            }

            if (type === "image" && !allowedExtensions.image.includes(ext)) {
                return res.status(400).json({ message: "Only image files (.jpg, .jpeg, .png) are allowed" });
            }

            try {
                if (type === "excel") {
                    const workbook = XLSX.readFile(req.file.path);
                    const sheetName = workbook.SheetNames[0];
                    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

                    req.importMeta = { type, moduleName };
                    req.importedData = data;

                    fs.unlinkSync(req.file.path);
                } else if (type === "image") {
                    req.importMeta = { type, moduleName };
                    req.importedFile = req.file;
                }

                next();
            } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "File processing error" });
            }
        },
    ];
};

module.exports = {
    AuthMiddleware,
    importHandler
};
