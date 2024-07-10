import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import UserController from './controllers/UserController.js';
import AuthController from './controllers/AuthController.js';

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    preflightContinue: true,
}));

app.use(bodyParser.json());

// Middleware para registrar todas las solicitudes entrantes
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use('/api/v1/users', UserController);
app.use('/api/v1/auth', AuthController);

app.listen(3001, () => {
    console.log('Server is running on port 3001');
});

