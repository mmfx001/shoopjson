require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Set mongoose to use strictQuery false
mongoose.set('strictQuery', false);

// Create Express app
const app = express();

// Middleware
app.use(express.json()); // Parse incoming JSON data
app.use(cors()); // Enable CORS for all requests

// MongoDB connection URI from environment variables
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://dilbekshermatov:x5MfF6l16cvmJKPX@cluster0.iead2.mongodb.net/yourDBName?retryWrites=true&w=majority&appName=Cluster0';

// Define Mongoose schemas and models

// Task Schema
const TaskSchema = new mongoose.Schema({
    id: String,
    Topic: String,
    description: String,
    requirement: String,
    materials: String,
}, { _id: false });

// Exam Schema
const ExamSchema = new mongoose.Schema({
    date: String,
}, { _id: false });

// Student Schema
const StudentSchema = new mongoose.Schema({
    id: String,
    tolov: Number,
    name: String,
    login: String,
    password: String,
    league: String,
    coins: Number,
    last: String,
    balance: Number,
    attendance: String,
    xp: String,
    group: String,
    time: String,
    teacher: String,
    
    image: String,
    likeItems: [String],
    status: String,
    type: String,
    tasks: [TaskSchema],
    coin: Number,
    exams: [ExamSchema],
}, { timestamps: true });

const Student = mongoose.model('Student', StudentSchema);

// Post Schema
const PostSchema = new mongoose.Schema({
    id: String,
    comment: String,
    name: String,
    likeCount: Number,
    timestamp: String,
    image: String,
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

// Comment Schema
const CommentSchema = new mongoose.Schema({
    id: String,
    productId: String,
    comment: String,
    author: String,
    timestamp: String,
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

// Shop Item Schema
const ShopItemSchema = new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    price: Number,
    currency: String,
    quantity: Number,
    status: String,
    promotion: String,
    image: String,
}, { timestamps: true });

const ShopItem = mongoose.model('ShopItem', ShopItemSchema);

// Shop History Schema
const ShopHistorySchema = new mongoose.Schema({
    shopItemId: String, // Reference to ShopItem
    action: String,
    status: String,
    quantityChanged: Number,
    priceChanged: Number, // Price change
    date: { type: Date, default: Date.now }, // Action date
    user: String, // Who performed the action (could be email or ID)
}, { timestamps: true });

const ShopHistory = mongoose.model('ShopHistory', ShopHistorySchema);

// File Schema
const FileSchema = new mongoose.Schema({
    id: String,
    filename: String,
    fileData: String,
    userId: String,
    timestamp: String,
    status: String,
}, { timestamps: true });

const File = mongoose.model('File', FileSchema);

// Teacher Schema
const TeacherGroupSchema = new mongoose.Schema({
    havtaKun: String,
    rooms: String,
    teacherName: String,
    groupTime: mongoose.Schema.Types.Mixed,
    groupNumber: String,
}, { _id: false });

const TeacherSchema = new mongoose.Schema({
    id: String,
    raqam: String,
    password: String,
    students: String,
    groupcount: String,
    level: String,
    teacher: String,
    surname: String,
    rol: String,
    filial: String,
    position: String,
    groups: [TeacherGroupSchema],
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', TeacherSchema);

// Admin Schema
const AdminSchema = new mongoose.Schema({
    id: String,
    raqam: String,
    password: String,
    filial: String,
}, { timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);


const TolovSchema = new mongoose.Schema({
    id: String,
    user_id: String,
    date: String,
    filial: String,
    price: String,
}, { timestamps: true });

const Tolov = mongoose.model('Tolov', TolovSchema);
// Rating Schema
const RatingSchema = new mongoose.Schema({
    id: String,
    name: String,
    QA: String,
    Ketganlar: String,
    Retention: String,
    Usage: String,
    Umumiy: String,
}, { timestamps: true });

const Rating = mongoose.model('Rating', RatingSchema);

// Project Schema
const ProjectSchema = new mongoose.Schema({
    id: String,
    name: String,
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

// Filial Schema
const FilialSchema = new mongoose.Schema({
    id: String,
    name: String,
    groups: String,
    teachers: String,
    students: String,
    location: String, 
}, { timestamps: true });

const Filial = mongoose.model('Filial', FilialSchema);

// CRUD Operation Router Generator
const createCRUDRoutes = (model, modelName) => {
    const router = express.Router();

    // Get all records
    router.get('/', async (req, res) => {
        try {
            const items = await model.find();
            res.json(items);
        } catch (err) {
            console.error(`GET /api/${modelName.toLowerCase()} error:`, err.message);
            res.status(500).json({ message: err.message });
        }
    });

    // Get single record by ID
    router.get('/:id', async (req, res) => {
        try {
            const item = await model.findOne({ id: req.params.id });
            if (!item) return res.status(404).json({ message: `${modelName} not found` });
            res.json(item);
        } catch (err) {
            console.error(`GET /api/${modelName.toLowerCase()}/${req.params.id} error:`, err.message);
            res.status(500).json({ message: err.message });
        }
    });

    // Create new record
    router.post('/', async (req, res) => {
        const newItem = new model(req.body);
        try {
            const savedItem = await newItem.save();
            res.status(201).json(savedItem);
        } catch (err) {
            console.error(`POST /api/${modelName.toLowerCase()} error:`, err.message);
            res.status(400).json({ message: err.message });
        }
    });

    // Update record by ID
    router.put('/:id', async (req, res) => {
        try {
            const updatedItem = await model.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
            res.json(updatedItem);
        } catch (err) {
            console.error(`PUT /api/${modelName.toLowerCase()}/${req.params.id} error:`, err.message);
            res.status(400).json({ message: err.message });
        }
    });

    // Delete record by ID
    router.delete('/:id', async (req, res) => {
        try {
            await model.findOneAndDelete({ id: req.params.id });
            res.json({ message: `${modelName} deleted successfully` });
        } catch (err) {
            console.error(`DELETE /api/${modelName.toLowerCase()}/${req.params.id} error:`, err.message);
            res.status(500).json({ message: err.message });
        }
    });

    return router;
};

// Use routers for each model
app.use('/api/students', createCRUDRoutes(Student, 'Student'));
app.use('/api/posts', createCRUDRoutes(Post, 'Post'));
app.use('/api/shophistory', createCRUDRoutes(ShopHistory, 'ShopHistory'));
app.use('/api/comments', createCRUDRoutes(Comment, 'Comment'));
app.use('/api/shop', createCRUDRoutes(ShopItem, 'ShopItem'));
app.use('/api/tolov', createCRUDRoutes(Tolov, 'Tolov'));
app.use('/api/admin', createCRUDRoutes(Admin, 'Admin'));
app.use('/api/files', createCRUDRoutes(File, 'File'));
app.use('/api/teachers', createCRUDRoutes(Teacher, 'Teacher'));
app.use('/api/rating', createCRUDRoutes(Rating, 'Rating'));
app.use('/api/projects', createCRUDRoutes(Project, 'Project'));
app.use('/api/filials', createCRUDRoutes(Filial, 'Filial'));

// MongoDB connection
const startServer = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
        const PORT = process.env.PORT || 5002;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit if connection fails
    }
};

// Start server
startServer();
