const User = require("./models").User;
const Wiki = require("./models").Wiki;

const bcrypt = require("bcryptjs");

module.exports = {
  getAllUsers(callback){
    return User.all()
    .then((users) => {
      function sortByUsername(users) {
        let swapped;
        do {
          swapped = false;
          for (let i=0; i < users.length; i++) {
            if (users[i] && users[i + 1] && users[i].username > users[i + 1].username) {
              [users[i], users[i + 1]] = [users[i + 1], users[i]];
              swapped = true;
            }
          }
        } while (swapped);
        
        return users;
      }

      sortByUsername(users);
      
      callback(null, users);
    })
    .catch((err) => {
      callback(err);
    })
  },
  
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

      Wiki.update({private: false}, {where: {userId: user.id}})

      .then((user) => {
        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      })
    })
  }

}