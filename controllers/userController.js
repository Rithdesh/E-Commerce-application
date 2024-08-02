const User = require("../models/userModel")
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// CREATE NEW USER

const secretkey = process.env.JWT_SECRET

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        // Create new user
        const newUser = new User({
            id: uuidv4(),
            name,
            email,
            password 
        });

        await newUser.save();
        console.log("Saving User....");
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//generating JWT key

const login = async(req,res)=>{
    const{email, password} = req.body;
    const user = await User.findOne({email});
    try{
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        const isValidPassword = await bcrypt.compare(password,user.password);
        if(!isValidPassword){
            return res.status(401).json({message: 'Invalid password'});
        }
        const token = jwt.sign({userid:user._id},secretkey,{
            expiresIn:"24hr",
        });
        res.json({token});
        console.log(`Logged in by ${user.name},ID ${user.id}`)
    }catch(err){
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};



module.exports = {signup,login}

