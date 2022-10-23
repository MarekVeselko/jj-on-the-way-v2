import { Router } from 'express';
import { user } from '../data';
import jtw from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import { UserModel } from '../models/user.model';

const router = Router();

router.get("/seed", expressAsyncHandler(
    async (req, res) => {
        const userCount = await UserModel.countDocuments();
        if (userCount > 0) {
            console.log("Seed is already done!");
            return;
        };
        await UserModel.create([user]);
        res.send("Seed is done!");
    }
));

router.post("/login", expressAsyncHandler(
    async (req, res) => {
        const { pin } = req.body;
        const foundUser = await UserModel.findOne({ pin });
        if (foundUser) {
            res.send(generateTokenResponse(user));
        } else {
            res.status(400).send("Invalid PIN");
        }
    }
));

const generateTokenResponse = (user: any) => {
    const token = jtw.sign(
        { name: user.name, isAdmin: user.isAdmin },
        "SomeRandomText",
        { expiresIn: "30d" }
    );

    user.token = token;
    return true;
}

export default router;