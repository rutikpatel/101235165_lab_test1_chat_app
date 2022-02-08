const User = require("./models/user");

class services {

    async createUser(userDetails) {
        const { userName, firstName, lastName, password } = userDetails;
        if (userName === undefined || userName === null || userName.trim().length === 0) {
            throw new Error("userName cannot be empty");
        }
        if (firstName === undefined || firstName === null || firstName.trim().length === 0) {
            throw new Error("First name cannot be empty");
        }
        if (lastName === undefined || lastName === null || lastName.trim().length === 0) {
            throw new Error("Last name cannot be empty");
        }
        if (password === undefined || password === null || password.trim().length === 0) {
            throw new Error("Password cannot be empty");
        }
        const userWithUserName = await User.findOne({ userName });
        if (userWithUserName !== null) {
            throw new Error("userName is already in use")
        }
        const user = new User(userDetails);
        await user.save();
        return {user}
    }

    async loginUser(userDetails) {
        const { userName, password } = userDetails;
        if (userName === undefined || userName === null) {
            throw new Error("Email is required");
        }
        if (password === undefined || password === null) {
            throw new Error("Password is required");
        }
        const user = await User.findOne({ userName });
        if (user === null) {
            throw new Error("This userName is not associated to any account");
        }
        if (user.password !== password) {
            throw new Error("Password is incorrect");
        }
        return { user }
    }
}

module.exports = new services;