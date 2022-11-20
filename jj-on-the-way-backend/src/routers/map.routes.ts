import { Router } from 'express';
import { map } from '../data';
import jtw from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import { MapModel } from '../models/map.model';

const router = Router();

router.get("/map-seed", expressAsyncHandler(
    async (req, res) => {
        const userCount = await MapModel.countDocuments();
        if (userCount > 0) {
            console.log("Seed is already done!");
            return;
        };
        await MapModel.create([map]);
        res.send("Seed is done!");
    }
));

router.get('/', expressAsyncHandler(
    async (req, res) => {
        const foundMap = await MapModel.find();
        res.send(foundMap);
    }
));

router.put('/edit-map', expressAsyncHandler(
    async (req, res) => {
        const foundMap = await MapModel.findByIdAndUpdate(req.body.id, req.body);
        res.send(foundMap);
    }
));

export default router;