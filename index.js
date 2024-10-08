// index.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

// Express ilovasini yaratish
const app = express();

// Middleware'lar
app.use(bodyParser.json());
app.use(cors());

// MongoDB ulanishi
const mongoURI = 'mongodb+srv://dilbekshermatov:dilbek1233@cluster0.y5hh3.mongodb.net/mydatabase?retryWrites=true&w=majority';

// Mongoose bilan MongoDB'ga ulanish
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    connectTimeoutMS: 30000, 
    socketTimeoutMS: 45000  
})
.then(() => console.log('MongoDB bilan muvaffaqiyatli ulandi'))
.catch(err => console.error('MongoDB ulanish xatosi:', err));

// Mongoose modellarini ta'riflash

// 1. Tort modeli
const TortSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    rasm: { type: String, required: true },
    nomi: { type: String, required: true },
    soha: { type: String, required: true },
    tafsiv: { type: String, required: true },
    narx: { type: String, required: true },
    manzil: { type: String, required: true },
    submittedAt: { type: String, required: true },
    telefon: { type: String, required: true },
    email: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    location: { type: String, required: true }
});

const Tort = mongoose.model('Tort', TortSchema);

// 2. QolMehnati modeli
const QolMehnatiSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    rasm: { type: String, required: true },
    nomi: { type: String, required: true },
    soha: { type: String, required: true },
    tafsiv: { type: String, required: true },
    manzil: { type: String, required: true },
    submittedAt: { type: String, required: true },
    email: { type: String, required: true },
    telefon: { type: String, required: true },
    narx: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    location: { type: String, required: true }
});

const QolMehnati = mongoose.model('QolMehnati', QolMehnatiSchema);

// 3. Kiyimlar modeli
const KiyimlarSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    rasm: { type: String, required: true },
    nomi: { type: String, required: true },
    soha: { type: String, required: true },
    tafsiv: { type: String, required: true },
    narx: { type: String, required: true },
    manzil: { type: String, required: true },
    submittedAt: { type: String, required: true },
    email: { type: String, required: true },
    telefon: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    location: { type: String, required: true }
});

const Kiyimlar = mongoose.model('Kiyimlar', KiyimlarSchema);

// 4. User modeli
const LikedItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    nomi: { type: String, required: true },
    tafsiv: { type: String, required: true },
    narx: { type: String, required: true },
    telefon: { type: String, required: true },
    rasm: { type: String, required: true },
    manzil: { type: String, required: true },
    email: { type: String, required: true },
    submittedAt: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    location: { type: String, required: true }
}, { _id: false });

const ViewedItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    narx: { type: String, required: true },
    email: { type: String, required: true },
    tafsif: { type: String, required: true },
    nomi: { type: String, required: true },
    viewedAt: { type: Date, required: true }
}, { _id: false });

const UserSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    likedItems: [LikedItemSchema],
    viewedItems: [ViewedItemSchema],
    likeCount: { type: Number, default: 0 },
    submissionLimit: { type: Number, default: 6 }
});

const User = mongoose.model('User', UserSchema);

// 5. TortBuyurtmalari modeli
const TortBuyurtmalariSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    nomi: { type: String, required: true },
    tafsiv: { type: String, required: true },
    qachongacha: { type: String, required: true },
    budjet: { type: String, required: true },
    telefon: { type: String, required: true },
    manzil: { type: String, required: true },
    submittedAt: { type: String, required: true },
    email: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    location: { type: String, required: true }
});

const TortBuyurtmalari = mongoose.model('TortBuyurtmalari', TortBuyurtmalariSchema);

// 6. QolMehnatiBuyurtmalari modeli
const QolMehnatiBuyurtmalariSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    nomi: { type: String, required: true },
    qachongacha: { type: String, required: true },
    tafsiv: { type: String, required: true },
    budjet: { type: String, required: true },
    telefon: { type: String, required: true },
    email: { type: String, required: true },
    submittedAt: { type: String, required: true },
    manzil: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    location: { type: String, required: true }
});

const QolMehnatiBuyurtmalari = mongoose.model('QolMehnatiBuyurtmalari', QolMehnatiBuyurtmalariSchema);

// 7. KiyimlarBuyurtmalari modeli
const KiyimlarBuyurtmalariSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    nomi: { type: String, required: true },
    tafsiv: { type: String, required: true },
    qachongacha: { type: String, required: true },
    budjet: { type: String, required: true },
    telefon: { type: String, required: true },
    submittedAt: { type: String, required: true },
    email: { type: String, required: true },
    manzil: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    location: { type: String, required: true }
});

const KiyimlarBuyurtmalari = mongoose.model('KiyimlarBuyurtmalari', KiyimlarBuyurtmalariSchema);

// 8. BarchaElonlar modeli
const BarchaElonlarSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    rasm: { type: String, required: true },
    nomi: { type: String, required: true },
    soha: { type: String, required: true },
    tafsiv: { type: String, required: true },
    narx: { type: String, required: true },
    manzil: { type: String, required: true },
    submittedAt: { type: String, required: true },
    email: { type: String, required: true },
    telefon: { type: String, required: true },
    likeCount: { type: Number, default: 0 },
    location: { type: String, required: true }
});

const BarchaElonlar = mongoose.model('BarchaElonlar', BarchaElonlarSchema);

// 9. BarchaBuyurtmalar modeli
const BarchaBuyurtmalarSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    nomi: { type: String, required: true },
    qachongacha: { type: String, required: true },
    tafsiv: { type: String, required: true },
    budjet: { type: String, required: true },
    telefon: { type: String, required: true },
    email: { type: String, required: true },
    submittedAt: { type: String, required: true },
    manzil: { type: String, required: true },
    location: { type: String, required: true }
});

const BarchaBuyurtmalar = mongoose.model('BarchaBuyurtmalar', BarchaBuyurtmalarSchema);

// 10. Message modeli
const MessageSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    text: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, required: true }
});

const Message = mongoose.model('Message', MessageSchema);

// 11. Comment modeli
const CommentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    productId: { type: String, required: true },
    comment: { type: String, required: true },
    userEmail: { type: String, required: true },
    timestamp: { type: Date, required: true }
});

const Comment = mongoose.model('Comment', CommentSchema);

// CRUD API Endpoints

// Utility funksiyasi: Model nomi va modelni qabul qilib, CRUD endpointlarini yaratish
const createCRUDRoutes = (basePath, Model) => {
    // GET barcha hujjatlarni olish
    app.get(`${basePath}`, async (req, res) => {
        try {
            const items = await Model.find();
            res.json(items);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    // GET bitta hujjatni id bo'yicha olish
    app.get(`${basePath}/:id`, getItem(Model), (req, res) => {
        res.json(res.item);
    });

    // POST yangi hujjat qo'shish
    app.post(`${basePath}`, async (req, res) => {
        const item = new Model(req.body);
        try {
            const newItem = await item.save();
            res.status(201).json(newItem);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // PUT (yangilash) mavjud hujjatni id bo'yicha
    app.put(`${basePath}/:id`, getItem(Model), async (req, res) => {
        Object.assign(res.item, req.body);
        try {
            const updatedItem = await res.item.save();
            res.json(updatedItem);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    });

    // DELETE mavjud hujjatni id bo'yicha
    app.delete(`${basePath}/:id`, getItem(Model), async (req, res) => {
        try {
            await res.item.remove();
            res.json({ message: 'Deleted' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
};

// Middleware funksiyasi: Hujjatni topish
function getItem(Model) {
    return async (req, res, next) => {
        let item;
        try {
            item = await Model.findOne({ id: req.params.id });
            if (item == null) {
                return res.status(404).json({ message: 'Cannot find item' });
            }
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }

        res.item = item;
        next();
    };
}

// Endpointlar yaratish

createCRUDRoutes('/tort', Tort);
createCRUDRoutes('/qolmehnati', QolMehnati);
createCRUDRoutes('/kiyimlar', Kiyimlar);
createCRUDRoutes('/users', User);
createCRUDRoutes('/tortbuyurtmalari', TortBuyurtmalari);
createCRUDRoutes('/qolmehnatibuyurtmalari', QolMehnatiBuyurtmalari);
createCRUDRoutes('/kiyimlarbuyurtmalari', KiyimlarBuyurtmalari);
createCRUDRoutes('/barchaelonlar', BarchaElonlar);
createCRUDRoutes('/barchabuyurtmalar', BarchaBuyurtmalar);
createCRUDRoutes('/messages', Message);
createCRUDRoutes('/comments', Comment);

// Serverni ishga tushurish
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishlamoqda`);
});
