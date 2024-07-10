import { Router } from 'express';
import UserService from '../services/UserService.js';
import NumberMiddleware from '../middlewares/number.middleware.js';
import UserMiddleware from '../middlewares/user.middleware.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/create', async (req, res) => {
    const response = await UserService.createUser(req);
    res.status(response.code).json(response.message);
});

router.post('/bulkCreate', async (req, res) => {
    const users = req.body.users; // Array de usuarios desde el cuerpo de la solicitud
    try {
        const result = await UserService.bulkCreateUsers(users);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error in bulkCreate endpoint:', error);
        res.status(500).json({ message: 'Error al procesar la solicitud' });
    }
});

router.get('/findUsers', async (req, res) => {
    try {
        const filters = {
            deleted: req.query.deleted === 'true', // Convierte a booleano si se envía 'true'
            name: req.query.name || null,          // Nombre para filtrar
            loggedInBefore: req.query.loggedInBefore ? new Date(req.query.loggedInBefore) : null,  // Fecha antes de la cual se inició sesión
            loggedInAfter: req.query.loggedInAfter ? new Date(req.query.loggedInAfter) : null       // Fecha después de la cual se inició sesión
        };

        const response = await UserService.findUsers(filters);
        res.status(response.code).json(response.message);
    } catch (error) {
        console.error('Error en findUsers endpoint:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint para obtener todos los usuarios activos
router.get('/getAllUsers', async (req, res) => {
    try {
        const response = await UserService.getAllUsers();
        res.status(response.code).json(response.message);
    } catch (error) {
        console.error('Error fetching all users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get(
    '/:id',
    [
        NumberMiddleware.isNumber,
        UserMiddleware.isValidUserById,
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions
    ],
    async (req, res) => {
        const response = await UserService.getUserById(req.params.id);
        res.status(response.code).json(response.message);
    }
);

router.put(
    '/:id',
    [
        NumberMiddleware.isNumber,
        UserMiddleware.isValidUserById,
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions,
    ],
    async (req, res) => {
        const response = await UserService.updateUser(req);
        res.status(response.code).json(response.message);
    }
);

router.delete(
    '/:id',
    [
        NumberMiddleware.isNumber,
        UserMiddleware.isValidUserById,
        AuthMiddleware.validateToken,
        UserMiddleware.hasPermissions,
    ],
    async (req, res) => {
       const response = await UserService.deleteUser(req.params.id);
       res.status(response.code).json(response.message);
    }
);

export default router;
