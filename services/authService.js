const bcrypt = require("bcrypt");

const userModel = require("./../models/User");
const jwt = require("./../lib/jwt");
const SECRET = require("./../config/secret");

const generateToken = async (createdUser) => {
    const payload = {
        _id: createdUser._id,
        username: createdUser.username
    }

    const token = await jwt.sign(payload, SECRET);
    return token;
}

const registerUser = async (data) => {
    const user = await userModel.findOne({ email: data.email });

    if (user) {
        throw new Error("User already exsist!");
    }

    const createdUser = await userModel.create(data);

    const token = await generateToken(createdUser);

    return token;
}

const loginUser = async (data) => {
    const user = await userModel.findOne({ email: data.email });

    if (!user) {
        throw new Error("Email or password are incorrect!");
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
        throw new Error("Email or password are incorrect!");
    }

    const token = await generateToken(user);

    return token;
}

module.exports = {
    registerUser,
    loginUser
}