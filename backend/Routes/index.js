const authRoute = require('./Authentication/auth');
const userRoute = require('./User/user');
const postRoutes = require('./Post/post');
const route = {
    authRoute,
    userRoute,
    postRoutes,
}

module.exports = route;