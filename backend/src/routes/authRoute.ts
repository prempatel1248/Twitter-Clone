import express, {Request, Response} from 'express';
import { User } from '../models/User';

const router = express.Router();

router.post('/signup', async (req:Request, res:Response)=>{
    let errors = [];
    if(!req.body.username || req.body.username===''){
        errors.push({field: 'username', message: 'Username is required'});
    }
    if(!req.body.password || req.body.password===''){
        errors.push({field: 'password', message: 'Password is required'});
    }
    if(!req.body.firstName || req.body.firstName===''){
        errors.push({field: 'firstName', message: 'Firstname is required'});
    }
    if(!req.body.lastName || req.body.lastName===''){
        errors.push({field: 'lastName', message: 'Lastname is required'});
    }
    if(errors.length>0){
        console.log(errors);
        res.status(400).json({errors: errors});
        return;
    }
    try {
        const existingUser = await User.findOne({username: req.body.username});
        if(existingUser){
            res.status(409).json({message: 'Username already exists'});
            return;
        }

        const user = new User({
            username: req.body.username,
            password: req.body.password,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        });
        await user.save();
        res.status(201).send('User created successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
})

module.exports = router;