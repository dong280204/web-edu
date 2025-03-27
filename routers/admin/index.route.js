const dashboardRoutes = require('./dashboard.route');
const productRoutes = require('./product.router');
const productCategoryRoutes = require('./product-category.router');
const accountRoutes = require('./account.router');
const authRoutes = require('./auth.route');
const authMidleware = require('../../middleware/admin/auth.midleware');
const myAccountRouter = require('./my-account.router');
const userRouter = require('./user.router');
const oderRouter = require('./order.router');


const systemConfig =require("../../config/system")
// chuyen huong tat ca router cua admin
module.exports = (app) => {
    const Path_admin = systemConfig.prefixAdmin;
    app.use(Path_admin + '/dashboard', authMidleware.requireAuth,dashboardRoutes)
    app.use(Path_admin + '/products',authMidleware.requireAuth, productRoutes)
    app.use(Path_admin + '/accounts',authMidleware.requireAuth, accountRoutes)
    app.use(Path_admin + '/auth', authRoutes)
    app.use(Path_admin + '/my-account',authMidleware.requireAuth, myAccountRouter)
    app.use(Path_admin + '/user',authMidleware.requireAuth, userRouter)
    app.use(Path_admin + '/order',authMidleware.requireAuth, oderRouter)
    app.use(Path_admin + '/products-category',authMidleware.requireAuth, productCategoryRoutes)

}