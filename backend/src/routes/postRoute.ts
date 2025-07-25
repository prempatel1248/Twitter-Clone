import express, { Request, Response } from 'express';
import { Post } from '../models/Post';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
});

router.put('/', async (req: Request, res: Response) => {
    try {
        await Post.deleteMany(); // remove all posts
        await Post.insertMany(req.body); // add new ones
        res.status(200).send('Posts updated');
    } catch (err: any) {
        res.status(500).send(err.message);
    }
})

module.exports = router;