import express from 'express';
import { allAccess, 
    userBoard, 
    adminBoard, 
    moderatorBoard,
    getAllUsers } 
    from '../controllers/user.controller.js';
import { verifyToken, 
    isAdmin, 
    isModerator } 
    from '../middlewares/authJwt.js';

const router = express.Router();

router.get('/all', allAccess);
router.get('/user', [verifyToken], userBoard);
router.get('/mod', [verifyToken, isModerator], moderatorBoard);
router.get('/admin', [verifyToken, isAdmin], adminBoard);
router.get('/users', getAllUsers);

router.post('/set-role', setUserRole); 

export default router;