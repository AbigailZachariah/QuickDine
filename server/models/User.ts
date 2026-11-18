import {Document, model, Schema} from 'mongoose'

export interface IUser extends Document{
    name: string;
    email: string;
    password?:string;
    phone?:string;
    role: "user" | "admin" | "owner";
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema=new Schema <IUser>(
    {
        // to add new user
        name:{type: String , required: true, trim:true},
        email:{type: String , required: true, unique:true, trim:true, lowercase: true},
        password:{type: String , required: true, minlength:6},
        phone:{type: String , trim: true, minlength:6},
        role:{type: String , enum: ["user" , "admin" , "owner"], default: "user"},
    },
    // automatically it will add created at and updated at, date and time
    {timestamps: true}
)

//Removing user password when converting to Json
UserSchema.set("toJSON",{
    transform: (doc,ret)=>{
        delete ret.password;
        return ret;
    }
})
export const User = model<IUser>("User", UserSchema)