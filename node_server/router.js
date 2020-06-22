var HomeController   = require('./Controllers/HomeController');
var UserController   = require('./Controllers/UserController');
const authMiddleware = require('./authHelper')
const cors           = require('cors');


// Routes
module.exports = function(app){  
    // Main Routes
    app.get('/',      HomeController.Index);

    app.get('/User/Register', UserController.Register);
    app.post('/User/RegisterUser', UserController.RegisterUser);
    app.get('/User/Login', UserController.Login);
    app.post('/User/LoginUser', UserController.LoginUser);
    app.get('/User/Logout', UserController.Logout);
    app.get('/User/SecureArea', UserController.SecureArea);
    app.get('/User/ManagerArea', UserController.ManagerArea);
    app.get('/User/Index', cors(), UserController.Index);
    // Sign in
    app.post(
        '/auth', cors(),
        // middleware that handles the sign in process
        authMiddleware.signIn,
        authMiddleware.signJWTForUser
    )

    app.post(
        '/editsalary', cors(),
        UserController.EditSalary
    );

    app.post(
      '/edit', cors(),
      UserController.EditProfile
    );

// Accessible to authenticated user. CORS must be enabled
// for client App to access it.
    app.get('/User/SecureAreaJwt', cors(),
        authMiddleware.requireJWT, UserController.SecureAreaJwt)

// Accessible to manager or admin. CORS must be enabled for
// client App to access it.
    app.get('/User/ManagerAreaJwt', cors(),
        authMiddleware.requireJWT, UserController.ManagerAreaJwt)


    app.get('/User/StaffAreaJwt', cors(),
        authMiddleware.requireJWT, UserController.StaffAreaJwt)


    app.get('/User/HRAreaJwt', cors(),
        authMiddleware.requireJWT, UserController.HRAreaJwt)


// Receives posted data from authenticated users.
    app.post('/User/PostAreaJwt', cors(),
        authMiddleware.requireJWT, UserController.PostAreaJwt)



};
