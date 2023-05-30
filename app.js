const express = require('express');
const app = express();
const dbConnect = require('./configs/dbConnect');
const userRouter = require('./routes/user');

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET, POST, PATCH, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization');
    next();
});

app.use('/user', userRouter);

const run = async () => {
    try {
        const connect = await dbConnect();
        if (!connect) {
            throw new Error('database cannot connected!');
        }
        console.log('Connected!');
        app.listen(process.env.PORT, () => {
            console.log(`Server running at ${process.env.PORT}`);
        })
    } catch(err) {
        console.log(err.message);
    }
}

run();