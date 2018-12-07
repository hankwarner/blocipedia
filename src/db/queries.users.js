const User = require("./models").User;
const Wiki = require("./models").Wiki;

const bcrypt = require("bcryptjs");

module.exports = {
  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getUser(id, callback){
    return User.findById(id, {
      include: [  {
        model: Wiki,
        as: "wikis"
      }]
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  upgradeRole(req, callback){
    return User.findById(req.user.id)

    .then((user) => {
      if(!user){
        return callback("User not found");
      }

      user.update({role: 1}, {where: {id: user.id}})

      .then((user) => {
        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      })
    })
  },

  downgradeRole(req, callback){
    return User.findById(req.user.id)

    .then((user) => {
      if(!user){
        return callback("User not found");
      }

      user.update({role: 0}, {where: {id: user.id}})

      .then((user) => {
        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      })
    })
  }

}