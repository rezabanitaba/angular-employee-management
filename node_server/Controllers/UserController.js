const User           = require('../Models/User');
var   passport       = require('passport');
const RequestService = require('../Services/RequestService');
const UserRepo       = require('../Data/UserRepo');
const _userRepo      = new UserRepo();

// Displays registration form.
exports.Register = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);
    res.render('User/Register', {errorMessage:"", user:{}, reqInfo:reqInfo})
};

// Handles 'POST' with registration form submission.
exports.RegisterUser  = async function(req, res){
   
    var password        = req.body.password;
    var passwordConfirm = req.body.passwordConfirm;

    if (password == passwordConfirm) {

        // Creates user object with mongoose model.
        // Note that the password is not present.
        var newUser = new User({
            firstName:    req.body.firstName,
            lastName:     req.body.lastName,
            email:        req.body.email,
            username:     req.body.username,
            phone:        req.body.phone,
            address:      req.body.address
        });
       
        // Uses passport to register the user.
        // Pass in user object without password
        // and password as next parameter.
        User.register(new User(newUser), req.body.password, 
                function(err, account) {
                    // Show registration form with errors if fail.
                    if (err) {
                        let reqInfo = RequestService.reqHelper(req);
                        return res.render('User/Register', 
                        { user : newUser, errorMessage: "Successfully Signed Up", 
                          reqInfo:reqInfo });
                    }
                    // User registered so authenticate and redirect to secure 
                    // area.
                    passport.authenticate('local') (req, res, 
                            function () { res.redirect('/User/SecureArea'); });
                });

    }
    else {
      res.render('User/Register', { user:newUser, 
              errorMessage: "Passwords do not match.", 
              reqInfo:reqInfo})
    }
};

// Shows login form.
exports.Login = async function(req, res) {
    let reqInfo      = RequestService.reqHelper(req);
    let errorMessage = req.query.errorMessage; 

    res.render('User/Login', { user:{}, errorMessage:errorMessage, 
                               reqInfo:reqInfo});
}

exports.LoginUser = async function(req, res, next) {
    let roles = await _userRepo.getRolesByUsername(req.body.username);
    sessionData = req.session;
    sessionData.roles  = roles;
  
    passport.authenticate('local', {
        successRedirect : '/User/SecureArea', 
        failureRedirect : '/User/Login?errorMessage=Invalid login.', 
    }) (req, res, next);
  };
  

// Log user out and direct them to the login screen.
exports.Logout = (req, res) => {
    req.logout();
    let reqInfo = RequestService.reqHelper(req);

    res.render('User/Login', { user:{}, isLoggedIn:false, errorMessage : "", 
                               reqInfo:reqInfo});
};


// This displays a view called 'securearea' but only 
// if user is authenticated.
exports.SecureArea  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req);

    if(reqInfo.authenticated) {
        res.render('User/SecureArea', {errorMessage:"", reqInfo:reqInfo})
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' + 
                     'must be logged in to view this page.')
    }
}

// This displays a view called 'securearea' but only 
// if user is authenticated.
exports.ManagerArea  = async function(req, res) {
    let reqInfo = RequestService.reqHelper(req, ['Admin', 'Manager']);

    if(reqInfo.rolePermitted) {
        res.render('User/ManagerArea', {errorMessage:"", reqInfo:reqInfo})
    }
    else {
        res.redirect('/User/Login?errorMessage=You ' + 
                     'must be logged in with proper permissions to view this page.')
    }
}

exports.Index = async function(request, response){
    let users = await _userRepo.allUsers();
    if(users!= null) {
        // response.render('User/Index', { users:users })
        response.json({users:users});
    }
    else {
        // response.render('User/Index', { users:[] })
        response.json({users:[]});
    }
};



exports.EditProfile = async function (req, res) {

    let username = req.body.username;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let phone = req.body.phone;
    let address = req.body.address;

    let tempUserData = new User({
        username: username,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
        address: address,
    });
    let responseObject = await  _userRepo.updateProfile(tempUserData);

    if(responseObject.errorMessage === ""){
        res.json({errorMessage:"You have successfully updated your profile", reqInfo:responseObject})
    } else {
        console.log(responseObject.errorMessage);
        res.json({errorMessage: responseObject.errorMessage})
    }
};



// This function returns data to authenticated users only.
exports.SecureAreaJwt  = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req);

    if(reqInfo.authenticated) {
        res.json({errorMessage:"", reqInfo:reqInfo,
            secureData: "Congratulations! You are authenticated and you have "
                +  "successfully accessed this message."})
    }
    else {
        res.json( {errorMessage:'/User/Login?errorMessage=You ' +
                'must be logged in to view this page.'})
    }
}

// This function returns data to logged in managers only.
exports.ManagerAreaJwt  = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['Manager']);

    if(reqInfo.rolePermitted) {
        res.json({errorMessage:"", reqInfo:reqInfo})
    }
    else {
        res.json({errorMessage:'You must be logged in with proper ' +
                'permissions to view this page.'});
    }
}

// This function returns data to logged in managers only.
exports.StaffAreaJwt  = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['Staff']);

    if(reqInfo.rolePermitted) {
        res.json({errorMessage:"", reqInfo:reqInfo})
    }
    else {
        res.json({errorMessage:'You must be logged in with proper ' +
                'permissions to view this page.'});
    }
}


// This function returns data to logged in managers only.
exports.HRAreaJwt  = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, ['HR']);

    if(reqInfo.rolePermitted) {
        res.json({errorMessage:"", reqInfo:reqInfo})
    }
    else {
        res.json({errorMessage:'You must be logged in with proper ' +
                'permissions to view this page.'});
    }
}

exports.EditSalary = async function (req, res) {

    let username = req.body.username;
    let salary = req.body.salary;
    let resObj = await _userRepo.updateSalary(salary, username);
    if(resObj.errorMessage === ""){
        res.json({errorMessage:"Successfully updated salary"})
    }
};

// This function receives a post from logged in users only.
exports.PostAreaJwt = async function(req, res) {
    let reqInfo = await RequestService.jwtReqHelper(req, []);
    console.log(req.body.msgFromClient);
    res.json({errorMessage:"", reqInfo:reqInfo,
        msgFromServer:"Hi from server"})
};
