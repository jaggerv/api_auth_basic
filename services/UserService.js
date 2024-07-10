import db from '../dist/db/models/index.js';
import bcrypt from 'bcrypt';

const bulkCreateUsers = async (users) => {
    let successfulCount = 0;
    let failedCount = 0;

    for (const user of users) {
        try {
            const result = await createUser({ body: user });
            if (result.code === 200) {
                successfulCount++;
            } else {
                failedCount++;
            }
        } catch (error) {
            console.error('Error creating user:', error);
            failedCount++;
        }
    }
    return {
        code: 200,
        message: `Registros exitosos: ${successfulCount}. Registros fallidos: ${failedCount}`
    };
};


const createUser = async (req) => {
    const {
        name,
        email,
        password,
        password_second,
        cellphone
    } = req.body;
    if (password !== password_second) {
        return {
            code: 400,
            message: 'Passwords do not match'
        };
    }
    const user = await db.User.findOne({
        where: {
            email: email
        }
    });
    if (user) {
        return {
            code: 400,
            message: 'User already exists'
        };
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.User.create({
        name,
        email,
        password: encryptedPassword,
        cellphone,
        status: true
    });
    return {
        code: 200,
        message: 'User created successfully with ID: ' + newUser.id,
    }
};

const getUserById = async (id) => {
    return {
        code: 200,
        message: await db.User.findOne({
            where: {
                id: id,
                status: true,
            }
        })
    };
}

const updateUser = async (req) => {
    const user = db.User.findOne({
        where: {
            id: req.params.id,
            status: true,
        }
    });
    const payload = {};
    payload.name = req.body.name ?? user.name;
    payload.password = req.body.password ? await bcrypt.hash(req.body.password, 10) : user.password;
    payload.cellphone = req.body.cellphone ?? user.cellphone;
    await db.User.update(payload, {
        where: {
            id: req.params.id
        }

    });
    return {
        code: 200,
        message: 'User updated successfully'
    };
}

const deleteUser = async (id) => {
    /* await db.User.destroy({
        where: {
            id: id
        }
    }); */
    const user = db.User.findOne({
        where: {
            id: id,
            status: true,
        }
    });
    await  db.User.update({
        status: false
    }, {
        where: {
            id: id
        }
    });
    return {
        code: 200,
        message: 'User deleted successfully'
    };
}

const getAllUsers = async () => {
    try {
        const users = await db.User.findAll({
            where: {
                status: true
            }
        });
        return {
            code: 200,
            message: users
        };
    } catch (error) {
        console.error('Error fetching users:', error);
        return {
            code: 500,
            message: 'Internal Server Error'
        };
    }
};

const findUsers = async (filters) => {
    const whereClause = {};
  
    if (filters.deleted !== undefined) {
      whereClause.status = !filters.deleted; // true para activos, false para eliminados
    }
  
    if (filters.name) {
      whereClause.name = { [db.Sequelize.Op.like]: `%${filters.name}%` };
    }
  
    if (filters.loggedInBefore) {
      whereClause.lastLoginAt = { [db.Sequelize.Op.lt]: filters.loggedInBefore };
    }
  
    if (filters.loggedInAfter) {
      whereClause.lastLoginAt = { [db.Sequelize.Op.gt]: filters.loggedInAfter };
    }
  
    try {
      const users = await db.User.findAll({ where: whereClause });
      return {
        code: 200,
        message: users,
      };
    } catch (error) {
      console.error('Error querying users:', error);
      return {
        code: 500,
        message: 'Internal Server Error',
      };
    }
  };



export default {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    getAllUsers,
    findUsers,
    bulkCreateUsers,
}