import express from 'express';
import { connectDB } from './connectDB';
const cors = require('cors')

const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/posts', postRoute);

app.listen(3001, () => {
    console.log('Server is running on port 3001');
})