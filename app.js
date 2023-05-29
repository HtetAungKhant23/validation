const express = require('express');
const app = express();
const dbConnect = require('./configs/dbConnect');

app.use(express.json());



const run = async () => {
    try {
        const connect = await dbConnect();
        if (connect) {
            console.log('Connected!');
            app.listen(process.env.PORT, () => {
                console.log(`Server running at ${process.env.PORT}`);
            })
        }
        throw new Error('database cannot connected!');
    } catch(err) {
        console.log(err.message);
    }
}

run();