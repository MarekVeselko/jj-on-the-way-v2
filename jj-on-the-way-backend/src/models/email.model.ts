import { Schema, model } from "mongoose";

export interface Email {
    name: string,
    surname: string,
    email: string,
    contactReason: Array<string>,
    text: string,
}


export const EmailSchema = new Schema<Email>({
    name: { type: String, required: true },
    surname: { type: String, required: false },
    email: { type: String, required: true },
    contactReason: [{ type: String, required: false }],
    text: { type: String, required: true },
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
})


export const EmailModel = model<Email>('email', EmailSchema);