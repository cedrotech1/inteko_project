import express from 'express';

import docrouter from '../documentation/index.doc.js';
import userRouter from './userRouter.js';
import authRouter from './authRouter.js';
import Post from './PostRouter.js';
import CategoriesRouter from './categoriesRouter.js';
import notification from './notificationRouter.js';
import Address from './AddressRouter.js';
import Attandance from './attandanceRoute.js';
import Penarity from './penarities.js';
import Fine from './penarityAmountRoutes.js';
const router = express.Router();

router.use('/docs', docrouter);
router.use('/users', userRouter);
router.use('/auth', authRouter);
router.use('/post', Post);
router.use('/penalties', Penarity);
router.use('/attandance', Attandance);
router.use('/categories', CategoriesRouter);
router.use('/address', Address);
router.use('/notification', notification);
router.use('/fine', Fine);



export default router;
