const config = require('../config.json');
const jwt = require('jsonwebtoken');
const Role = require('../helpers/role');

// users hardcoded for simplicity, store in a db for production applications
const users = [
    { id: 1, username: 'admin1', password: 'admin2', firstName: 'Admin', lastName: 'User', role: Role.Admin },
    { id: 2, username: 'admin2', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.Admin },
    { id: 3, username: 'user1', password: 'user2', firstName: 'Normal', lastName: 'User', role: Role.Regular },
    { id: 4, username: 'user2', password: 'user', firstName: 'Normal', lastName: 'User', role: Role.Regular },

];

async function authenticate({ name, password }) {
    const user = users.find(u => u.username === name && u.password === password);
    if (user) {
        const token = jwt.sign({ sub: user.id, role: user.role }, config.secret);
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}

async function getById(id) {
    const user = users.find(u => u.id === parseInt(id));
    if (!user) return;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

module.exports = {
    authenticate,
    getAll,
    getById
};