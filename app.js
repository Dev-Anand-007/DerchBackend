require('dotenv').config(); 
const express=require('express');
const app=express();
const cors=require('cors')

// const cookieParser=require('cookie-parser');
const path=require('path');
const db =require('./config/mongoose-conntection');

const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');

//routes
const authRouter=require('./routes/authRouter');
const adminRouter=require('./routes/adminRouter');
const usersRouter=require('./routes/usersRouter');




app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs')
app.use(cors(
   { origin: true,
    credentials:true,
    method:['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
    allowedHeaders:['Content-Type','Authorization'],

}

))


app.use('/api/auth',authRouter)
app.use('/api/admin',adminRouter);
app.use('/api/',usersRouter);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
