import { Router } from 'express';
import expressAsyncHandler from 'express-async-handler';
import { ArticleModel } from '../models/article.model';

const router = Router();

// router.get("/seed", expressAsyncHandler(
//     async (req, res) => {
//         const articlesCount = await ArticleModel.countDocuments();
//         if (articlesCount > 0) {
//             console.log("Seed is already done!");
//             return;
//         };
//         await ArticleModel.create(articles);
//         res.send("Seed is done!");
//     }
// ));


router.get("/all/:lang/:articleType/:sectionType/:searchedText?", expressAsyncHandler(
    async (req, res) => {
        const articleType = req.params.articleType;
        const lang = req.params.lang;
        const searchRegex = new RegExp(req.params.searchedText, 'i');
        const sectionType = req.params.sectionType;
        // const articles = await ArticleModel.find();
        let foundArticles;
        if (articleType === 'PUBLISHED') {
            if (!sectionType || sectionType === 'all') {
                if (lang == 'both') {
                    foundArticles = await ArticleModel.find({ published: true, isDeleted: false, title: { $regex: searchRegex } }).sort({ dateCreated: 'desc' });
                } else {
                    foundArticles = await ArticleModel.find({ published: true, isDeleted: false, language: lang, title: { $regex: searchRegex } }).sort({ dateCreated: 'desc' });
                }
            } else {
                foundArticles = await ArticleModel.find({ published: true, isDeleted: false, language: lang, section: sectionType, title: { $regex: searchRegex } }).sort({ dateCreated: 'desc' });
            }
        } else if (articleType === 'SAVED') {
            foundArticles = await ArticleModel.find({ published: false, isDeleted: false, title: { $regex: searchRegex } }).sort({ dateCreated: 'desc' });
        } else if (articleType === 'DELETED') {
            foundArticles = await ArticleModel.find({ isDeleted: true, title: { $regex: searchRegex } }).sort({ dateCreated: 'desc' });
        } else if (articleType == null) {
            foundArticles = await ArticleModel.find({ title: { $regex: searchRegex } }).sort({ dateCreated: 'desc' });
        }
        res.send(foundArticles);
    }
));

router.get("/articlesByCountry/:lang/:country", expressAsyncHandler(
    async (req, res) => {
        const country = req.params.country;
        const language = req.params.lang;
        const foundArticles = await ArticleModel.find({ country: country, language: language, published: true, isDeleted: false });
        res.send(foundArticles);
    }
));

router.get("/article/:id", expressAsyncHandler(
    async (req, res) => {
        const foundArticle = await ArticleModel.findById(req.params.id);
        res.send(foundArticle);
    }
))

router.post('/create', expressAsyncHandler(
    async (req, res) => {
        const request = req.body;
        if (Object.keys(req.body).length <= 0) {
            res.send().status(400);
            return
        }
        const newArticle = new ArticleModel(request);
        await newArticle.save();
        res.send(newArticle);
    }
));

router.put('/edit', expressAsyncHandler(
    async (req, res) => {
        const foundArticle = await ArticleModel.findByIdAndUpdate(req.body.id, req.body);
        res.send(foundArticle);
    }
));

router.delete('/delete/:id', expressAsyncHandler(
    async (req, res) => {
        const body = req.body;
        const foundArticle = await ArticleModel.findByIdAndRemove(req.params.id);
        res.send(foundArticle);
    }
));


export default router;