import { Schema, model } from "mongoose";

export interface Article {
    title: string,
    perex: string,
    text: Array<Object>,
    titleImage: string,
    gallery: Array<string>,
    dateCreated: Date,
    section: string,
    id: string,
    isDeleted: boolean,
    published: boolean
}


export const ArticleSchema = new Schema<Article>({
    title: { type: String, required: true },
    perex: { type: String },
    text: [{ type: Object }],
    titleImage: { type: String, required: false },
    section: {type: String, required: true },
    gallery: [{ type: String, required: false }],
    dateCreated: { type: Date, required: true },
    isDeleted: { type: Boolean, required: true },
    published: { type: Boolean, required: true }
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
})


export const ArticleModel = model<Article>('article', ArticleSchema);