import db from '../dist/db/models/index.js';
import bcrypt from 'bcrypt';

const login = async (email, password) => {
    const response = await db.User.findOne({
        where: {
            email: email
        }
    });
    if(!response || !bcrypt.compareSync(password, response.password)){
        return {
            code: 401,
            message: 'Unauthorized'
        }
    }

    const expiration = (new Date()).setHours((new Date()).getHours() + 1);

    const token = Buffer.from(JSON.stringify({
        name: response.name,
        email: response.email,
        id: response.id,
        roles: ['user'],
        expiration: expiration,
    })).toString('base64');

    const session = {
        id_user: response.id,
        token: token,
        expiration: expiration,
    }

    await db.Session.create(session);

    const now = new Date();
    await db.User.update({ lastLoginAt: now }, { where: { id: response.id } });

    return {
        code: 200,
        message: token
    };
}

const logout = async (token) => {
    const session = await db.Session.findOne({
        where: {
            token: token
        }
    });
    session.expiration = new Date();
    session.save();
    return {
        code: 200,
        message: 'Logged out'
    };
}

export default {
    login,
    logout,
}