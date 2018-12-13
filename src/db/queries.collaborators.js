const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;

module.exports = {
  createCollaborator(req, val, callback){
    return User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then((user) => {
        Collaborator.findOne({
            where: {
                userId: user.id,
                wikiId: req.params.wikiId
            }
        })
        .then((collaborator) => {
            if(collaborator) {
               collaborator.value = val;
               collaborator.save()
                .then((collaborator) => {
                    callback(null, collaborator);
                }) 
            } else {
                Collaborator.create({
                    value: val,
                    wikiId: req.params.wikiId,
                    userId: user.id
                })
                .then((collaborator) => {
                    callback(null, collaborator)
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        })
    })
  },

  deleteCollaborator(req, callback){
    return Collaborator.findById(req.params.collaboratorId)
    .then((collaborator) => {
        collaborator.destroy()
        .then((res) => {
            callback(null, collaborator);
        })
    })
    .catch((err) => {
        console.log(err);
    })
  }
}