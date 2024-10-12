const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Express ilovasini yaratish
const app = express();

// Middleware
app.use(express.json()); // body-parser o'rnini bosadi
app.use(cors());

// MongoDB ulanish manzili (ma'lumotlar bazasi nomini qo'shing, masalan, 'marsit')
const mongoURI = 'mongodb+srv://dilbekshermatov:dilbek1233@cluster0.zes33.mongodb.net/marsit?retryWrites=true&w=majority&appName=Cluster0';

// MongoDB ga ulanish
mongoose.connect(mongoURI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // 5 sekundga kamaytirish
})
.then(() => console.log('MongoDB ga ulandi'))
.catch(err => {
    console.error('MongoDB ulanish xatosi:', err.message);
});

// Mongoose Schemalari va Modellari

// 1. Students
const TaskSchema = new mongoose.Schema({
    id: String,
    Topic: String,
    description: String,
    requirement: String,
    materials: String
}, { _id: false });

const ExamSchema = new mongoose.Schema({
    date: String
}, { _id: false });

const StudentSchema = new mongoose.Schema({
    id: String,
    tolov: Number,
    name: String,
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
    likedItems: [String],
    image: String,
    likeItems: [String],
    tasks: [TaskSchema],
    coin: Number,
    exams: [ExamSchema]
}, { timestamps: true });

const Student = mongoose.model('Student', StudentSchema);

// 2. Posts
const PostSchema = new mongoose.Schema({
    id: String,
    comment: String,
    name: String,
    likeCount: Number,
    timestamp: String,
    image: String
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);

// 3. Comments
const CommentSchema = new mongoose.Schema({
    id: String,
    productId: String,
    comment: String,
    author: String,
    timestamp: String
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

// 4. Shop
const ShopItemSchema = new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    price: Number,
    currency: String,
    quantity: Number,
    promotion: String,
    image: String
}, { timestamps: true });

const ShopItem = mongoose.model('ShopItem', ShopItemSchema);

// 5. Files
const FileSchema = new mongoose.Schema({
    id: String,
    filename: String,
    fileData: String,
    userId: String,
    timestamp: String,
    status: String
}, { timestamps: true });

const File = mongoose.model('File', FileSchema);

// 6. Teachers
const TeacherGroupSchema = new mongoose.Schema({
    groupNumber: String,
    time: String,
    studentscount: String,
    coins: mongoose.Schema.Types.Mixed,
    group: String
}, { _id: false });

const TeacherSchema = new mongoose.Schema({
    id: String,
    teacher: String,
    password: String,
    students: String,
    groupcount: String,
    level: String,
    groups: [TeacherGroupSchema]
}, { timestamps: true });

const Teacher = mongoose.model('Teacher', TeacherSchema);

// 7. Rating
const RatingSchema = new mongoose.Schema({
    id: String,
    name: String,
    QA: String,
    Ketganlar: String,
    Retention: String,
    Usage: String,
    Umumiy: String
}, { timestamps: true });

const Rating = mongoose.model('Rating', RatingSchema);

// 8. Projects
const ProjectSchema = new mongoose.Schema({
    id: String,
    name: String
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

// 9. Filials
const FilialSchema = new mongoose.Schema({
    id: String,
    name: String,
    location: String // 'loaciton' xatosi tuzatildi
}, { timestamps: true });

const Filial = mongoose.model('Filial', FilialSchema);

// CRUD Operatsiyalari uchun Routerlar

// Generic CRUD funksiyasi
const createCRUDRoutes = (model, modelName) => {
    const router = express.Router();

    // GET Barcha Ma'lumotlar
    router.get('/', async (req, res) => {
        try {
            const items = await model.find();
            res.json(items);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // GET Bitta Ma'lumot
    router.get('/:id', getItem(model, modelName), (req, res) => {
        res.json(res.item);
    });

    // POST Yangi Ma'lumot Qo'shish
    router.post('/', async (req, res) => {
        console.log(`POST /api/${modelName.toLowerCase()}`);
        console.log('Request Body:', req.body);
        const item = new model(req.body);
        try {
            const newItem = await item.save();
            res.status(201).json(newItem);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // PUT Ma'lumotni Yangilash
    router.put('/:id', getItem(model, modelName), async (req, res) => {
        Object.assign(res.item, req.body);
        try {
            const updatedItem = await res.item.save();
            res.json(updatedItem);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // DELETE Ma'lumotni O'chirish
    router.delete('/:id', getItem(model, modelName), async (req, res) => {
        try {
            await res.item.remove();
            res.json({ message: `${modelName} o'chirildi` });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    return router;
};

// Middleware: Ma'lumotni Topish
function getItem(model, modelName) {
    return async (req, res, next) => {
        let item;
        try {
            item = await model.findOne({ id: req.params.id });
            if (item == null) {
                return res.status(404).json({ message: `${modelName} topilmadi` });
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }

        res.item = item;
        next();
    };
}

// Routerlarni Ulash
app.use('/api/students', createCRUDRoutes(Student, 'Student'));
app.use('/api/posts', createCRUDRoutes(Post, 'Post'));
app.use('/api/comments', createCRUDRoutes(Comment, 'Comment'));
app.use('/api/shop', createCRUDRoutes(ShopItem, 'ShopItem'));
app.use('/api/files', createCRUDRoutes(File, 'File'));
app.use('/api/teachers', createCRUDRoutes(Teacher, 'Teacher'));
app.use('/api/rating', createCRUDRoutes(Rating, 'Rating'));
app.use('/api/projects', createCRUDRoutes(Project, 'Project'));
app.use('/api/filials', createCRUDRoutes(Filial, 'Filial'));

// Serverni Ishga Tushurish
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishlamoqda`);
});
