import express, { Request, Response } from 'express';
import { User } from '../models/User';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

router.put('/', async (req: Request, res: Response) => {
    try {
        await User.deleteMany(); // wipe existing
        await User.insertMany(req.body); // insert new users
        res.status(200).send('Users updated');
    } catch (err: any) {
        res.status(500).send(err.message);
    }
})

module.exports = router;