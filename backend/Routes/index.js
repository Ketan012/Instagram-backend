const authRoute = require('./Authentication/auth');
const userRoute = require('./User/user');
const route = {
    authRoute,
    userRoute
}

module.exports = route;