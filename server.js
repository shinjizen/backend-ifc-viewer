import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getFile } from './services/app.js';
import { storage } from './services/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create storage folder for uploaded IFC files
// const storageMulter = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, join(__dirname, '/uploads'));
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname);
//     }
// });

app.use(cors());

const upload = multer({ 
    // storage: storageMulter,
    limits: { fileSize: 4 * 1024 * 1024 }
 });

app.get('/', function (req, res) {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});

// POST: Upload file to server
app.post('/upload', upload.single('file'), async (req, res) => {
    console.log(`Received file upload request: ${req.file ? req.file.originalname : 'No file uploaded'}`);
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }
    try {
        const storageRef = ref(storage, `uploads/${req.file.originalname}`);
        await uploadBytes(storageRef, req.file.buffer);
        const downloadURL = await getDownloadURL(storageRef);
        res.status(200).json({ message: `File uploaded: ${req.file.originalname}` });
    } catch (err) {
        res.status(500).json({ error: 'Error reading file: ' + err.message });
    }
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
