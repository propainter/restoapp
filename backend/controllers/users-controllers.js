const fs = require('fs');

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const Constants = require('../util/Constants');
const mongooseUniqueValidator = require('mongoose-unique-validator');


// * Regular User: Can rate and leave a comment for a restaurant
// * Owner: Can create restaurants and reply to comments about owned restaurants
// * Admin: Can edit/delete all users, restaurants, comments, and reviews

const getUsers = async (req, res, next) => {
  // check role permitted
  if(!(req.userData.userRole && Constants.isAdmin(req.userData.userRole))){
    const error = new HttpError('This user is not permitted to view users.', 401);
    return next(error);
  }

  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};


const deleteUser = async(req, res, next) => {
  const userId = req.params.userId;
  const userRole = req.userData.userRole;
  if(!(userRole && Constants.isAdmin(userRole))){
    const error = new HttpError('You are not authorized to delete this user', 401);
    return next(error);
  }

  let user;
  try{
    user = await (await User.findById(userId))
  } catch (err) {
    const error = new HttpError(
      'SOmething went wrong, could not delete user.',
      500
    );
    return next(error);
  }
  if(!user){
    const error = new HttpError('Could not find user for this id.', 404);
    return next(error);
  }
  const imagePath = user.image;
  try{
    // const sess = await mongoose.startSession();
    // await user.remove({session: sess});
    // await sess.commitTransaction();
    user.remove();
  }catch (err){
    const error = new HttpError(
      'Somethign went wrong, could not delete user.',
      500
    );
    return next(error);
  }
  fs.unlink(imagePath, err => {
    // console.log('could not delete user image', err);
  });

  res.status(200).json({message: 'Deleted user successfully.'});
}

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { name, email, password, role } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  let userRole;
  if(Constants.ROLES.find(item => item === role)){
    userRole = role;
  }else{
    userRole = Constants.ROLES[0];
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    places: [],
    role: userRole
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.APP_JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email, userRole: existingUser.role },
      process.env.APP_JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    userRole: existingUser.role,
    token: token
  });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.deleteUser = deleteUser;
