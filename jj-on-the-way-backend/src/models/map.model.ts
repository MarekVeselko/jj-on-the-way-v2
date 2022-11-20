import { Schema, model } from "mongoose";

export interface Map {
    pins: Array<Object>;
}


export const MapSchema = new Schema<Map>({
    pins: [{ type: Object, required: true }]
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
})


export const MapModel = model<Map>('map', MapSchema);