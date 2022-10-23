import { Schema, model } from "mongoose";

export interface User {
    name: string;
    pin: string;
    isAdmin: Boolean;
}


export const UserSchema = new Schema<User>({
    name: {type: String, required: true},
    pin: {type: String, required: true},
    isAdmin: {type: Boolean, default: true},
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
})


export const UserModel = model<User>('user', UserSchema);