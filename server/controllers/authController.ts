import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { User } from "../models/User.js";
import bcrypt from "bcrypt"

// Helper to generate JWT Token
const generateToken=(id:string) => {
    //token expires in 30 days
    return jwt.sign({id},process.env.JWT_SECRET as string, { expiresIn: "30d"})
}

// To register a new user
// POST-->type  /api/auth/register-->path

//Promise<void>--> response type (this function wont return anything)
export const registerUser = async (req: Request,res:Response): Promise<void> => {
    //to generate token we will be using JSON web token package
    try {
        const { name, email, password, phone, role}=req.body;
        if(!name || !email || !password){
            res.status(400).json({message: "Please enter all required fields"})
            return;
        }

        //Checking if the user already exists with this email ID
        const userExists = await User.findOne({email})
        if(userExists){
            res.status(400).json({message: "User already exists"})
            return;
        }
        
        //hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role,
        })

        //if user exits
        if(user){
            res.status(201).json({
                _id: user._id,
                name:user.name,
                email:user.email,
                phone:user.phone,
                role:user.role,
                token : generateToken(user._id.toString())
            })
        }
        else{
            res.status(400).json({message: "Invalid user data"});
        }

    } catch (error: any) {
        console.error(error);
        res.status(400).json({message: error.message});
    }    
}


//Function to login user (authenticate user and get token)
// POST-->type  /api/auth/register-->path
export const loginUser = async (req: Request,res:Response): Promise<void> => {
    try {
        const { email, password }=req.body;
        if(!email || !password){
            res.status(400).json({message: "Please provide email and password"})
            return;
        }

        //check for user
        const user = User.findOne({email})

        if(!user){
            res.status(401).json({message: "Invail email or password"});
        }

        //check if the password matches
        const isMatch = await bcrypt.compare(password,user.password || "")
    } catch (error) {
        
    }    
}

// Get user profile
// GET /api/auth/me
// to access private data 
export const getMe = async (req: Request,res:Response): Promise<void> => {
    try {
        
    } catch (error) {
        
    }    
}