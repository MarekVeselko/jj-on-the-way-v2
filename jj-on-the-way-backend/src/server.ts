import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import express from "express";

const enforce = require('express-sslify');

import cors from "cors";
import articleRouter from './routers/articles.router';
import userRouter from './routers/user.router';
import emailRouter from  './routers/email.router';
import mapRouter from './routers/map.routes';
import { dbConnect } from './configs/database.configs';
dbConnect();


const app = express();
app.use(express.json());
app.use(cors({
    credentials: true,
    origin: ["http://localhost:4200"]
}));

if (app.get("env") === "production") {
    app.use(enforce.HTTPS({ trustProtoHeader: true }));
}
app.use("/api/articles", articleRouter);
app.use("/api/users", userRouter);
app.use("/api/email", emailRouter);
app.use("/api/map", mapRouter);

app.use(express.static('./public'));
app.get('*', (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Website server on port http://localhost:" + port);
});