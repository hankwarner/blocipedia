const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;

const Authorizer = require("../policies/wiki");

module.exports = {
  getAllWikis(callback){
    return Wiki.all({
      include: [
        {model: Collaborator, as: "collaborators"}
      ]
    })
    .then((wikis) => {
      function sortByUpdatedAtDate(wikis) {
        let swapped;
        do {
          swapped = false;
          for (let i=0; i < wikis.length; i++) {
            if (wikis[i] && wikis[i + 1] && wikis[i].updatedAt < wikis[i + 1].updatedAt) {
              [wikis[i], wikis[i + 1]] = [wikis[i + 1], wikis[i]];
              swapped = true;
            }
          }
        } while (swapped);
        
        return wikis;
      }

      sortByUpdatedAtDate(wikis);
      
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    })
  },

  searchByTitle(searchTitle, callback){
    return Wiki.findAll({
      where: {
        title: searchTitle
      }, include: [{
        model: Collaborator, as: "collaborators"
      }]
    })
    .then((result) => {      
      callback(null, result);
    })
    .catch((err) => {
      callback(err);
    })
  },

  addWiki(newWiki, callback){
      return Wiki.create(newWiki)
      .then((wiki) => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      })
  },

  getWiki(id, callback){
    return Wiki.findById(id, {
      include: [{
        model: Collaborator, 
        as: "collaborators",
        include: [{
          model: User
        }]
      }]
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },

  deleteWiki(req, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      const authorized = new Authorizer(req.user, wiki).destroy();
      if(authorized) {
        wiki.destroy()
        .then((res) => {
          callback(null, wiki);
        })
      } else {
        req.flash("notice", "You are not authorized to do that.")
        callback(401);
      }
    })
    .catch((err) => {
      callback(err);
    })
  },

  updateWiki(req, updatedWiki, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      if(!wiki){
        return callback("Wiki not found");
      }

      const authorized = new Authorizer(req.user, wiki).update();
      
      if(authorized) {
        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          callback(null, wiki);
        })
        .catch((err) => {
          callback(err);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
          callback("Forbidden");
      }
    });
  }
}