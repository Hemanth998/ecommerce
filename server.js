const express = require('express');
const path = require('path');

const connectDB = require('./config/db');

connectDB();

const app = express();

app.use(express.json({extended : false}));

//routes

app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/items',require('./routes/api/items'));
app.use('/api/orders',require('./routes/api/orders'));

//serve static assets in production

if(process.env.NODE_ENV === 'production'){

    app.use(express.static('client/build'));

app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
})
}



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));