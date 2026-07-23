const express=require('express');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
const cors=require('cors');
const path=require('path');

dotenv.config();

const app = express();

//MIDDLE WARE SECTION
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));

//STATIC FILES
app.use(express.static(path.join(__dirname,"public")));
app.use(express.static(path.join(__dirname,"views")));

//ROUTES

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

app.use('/api/auth',authRoutes);
app.use('/api/movies',movieRoutes);


//MONGODB CONNECTION

mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MongoDB Atlas connected");   
    }).catch((err)=>{
        console.log(err);
    });

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"views",'index.html'));
})

const port = process.env.port || 3000;

app.listen(port,()=>{
    console.log(`app is listening on http://localhost:${port}`)
})