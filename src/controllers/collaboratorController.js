const collaboratorQueries = require("../db/queries.collaborators.js");

module.exports = {
    addCollaborator(req, res, next){
        if(req.user){
            collaboratorQueries.createCollaborator(req, 1, (err, collaborator) => {
                if(err){
                    req.flash("error", err);
                }
                res.redirect(req.headers.referer);
            })
        } else {
            req.flash("notice", "You must be signed in to do that.")
            res.redirect(req.headers.referer);
        }
    },

    removeCollaborator(req, res, next){
        if(req.user){
            collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {
                if(err){
                    req.flash("err", err);
                }
                res.redirect(req.headers.referer);
            })
        } else {
            req.flash("notice", "You must be signed in to do that.")
            res.redirect(req.headers.referer);
        }
    }
}
