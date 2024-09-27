import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getFile } from './services/app.js';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create storage folder for uploaded IFC files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, join(__dirname, '/uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

app.use(cors());

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 4 * 1024 * 1024 }
 });

app.get('/', function (req, res) {
    res.send('Hello world!');
});

// POST: Upload file to server
app.post('/upload', upload.single('file'), (req, res) => {
    console.log(`Received file upload request: ${req.file ? req.file.originalname : 'No file uploaded'}`);
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).send(`File uploaded: ${req.file.originalname}`);
});

// GET: Url path for get file by filename
app.get('/get/ifc/:filename', async (req, res) => {
    const fileName = req.params.filename
    try {
        const fileData = await getFile(fileName);
        res.send(fileData);
    } catch (err) {
        res.status(500).send('Error reading file: ' + err.message);
    }
});

export default app;
