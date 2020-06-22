const User = require('../Models/User');

class UserRepo {
    UserRepo() {        
    }

        // Gets all users.
    async allUsers() {     
            let users = await User.find().exec();
            return   users;
        }

    async getUserByUsername(username) {
        var user = await User.findOne({username: username});
        if(user) {
            let respose = { obj: user, errorMessage:"" }
            return respose;
        }
        else {
            return null;
        }
    }

    async getRolesByUsername(username) {
        var user = await User.findOne({username: username}, {_id:0, roles:1});
        if(user.roles) {
            return user.roles;
        }
        else {
            return [];
        }
    }    


    async getEverything() {
        var user = await User.findOne({username: username, email:email, address:address}, {_id:0, roles:1});
        if(user.roles) {
            return (user.email, user.address);
        }
        else {
            return [];
        }
    }


    async updateProfile(editedObj) {
        let response = {
            obj: editedObj,
            errorMessage: ""
        };
        try {
            var error = await editedObj.validateSync();
            if (error) {
                console.log(JSON.stringify(error.message));
                response.errorMessage = error.message;
                return response;
            }
            let userObject = await this.getUserByUsername(editedObj.username);
            if (userObject) {
                let updated = await User.updateOne(
                    {username: editedObj.username},
                    {
                        $set: {
                            username: editedObj.username,
                            firstName: editedObj.firstName,
                            lastName: editedObj.lastName,
                            email: editedObj.email,
                            phone: editedObj.phone,
                            address: editedObj.address,
                        }
                    });

                if (updated.nModified != 0) {
                    response.obj = editedObj;
                    return response;
                }
                else {
                    respons.errorMessage =
                        "An error occurred during the update. The item did not save."
                }
                return response;
            }
            else {
                response.errorMessage = "An item with this id cannot be found."
            }
            return response;
        }
        catch (err) {
            response.errorMessage = err.message;
            return response;
        }
    }





    async updateSalary(salary, username) {
        let res = {
            salary: salary,
            username: username,
            errorMessage: ''
        };
        try {
            let userObject = await this.getUserByUsername(username);
            if (userObject) {
                let updated = await User.updateOne(
                    {username: username},
                    {
                        $set: {
                            salary: salary
                        }
                    });

                if (updated.nModified != 0) {
                    return salary;
                }
                else {
                    res.errorMessage =
                        "An error occurred during the update. The item did not save."
                }
                return res;
            }
            else {
                res.errorMessage = "An item with this id cannot be found."
            }
            return res;
        }
        catch (err) {
            res.errorMessage = err.message;
            return res;
        }
    }
}



module.exports = UserRepo;

