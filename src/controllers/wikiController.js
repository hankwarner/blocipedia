const wikiQueries = require("../db/queries.wikis.js");
const userQueries = require("../db/queries.users.js");

const Authorizer = require("../policies/wiki");
const markdown = require("markdown").markdown;

module.exports = {
  index(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
        if(err){                
          res.redirect(500, "static/index");
        } else {
          res.render("wikis/index", {wikis});
        }
    })
  },

  new(req, res, next){
    const authorized = new Authorizer(req.user).new();

    if(authorized) {
        res.render("wikis/new");
    } else {
        req.flash("notice", "You are not authorized to do that.");
        res.redirect("/wikis");
    }
  },

  create(req, res, next){
    const authorized = new Authorizer(req.user).create();
    const private = (req) => {
      if(req.body.private === "true") {
        return true;
      } else {
        return false;
      }
    }

    if (authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: private(req),
        userId: req.user.id
      };
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if(err){
          res.redirect(500, "/wikis/new");
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },

  show(req, res, next){
      wikiQueries.getWiki(req.params.id, (err, wiki) => {
        var markdownWiki = wiki;
        markdownWiki.body = markdown.toHTML(markdownWiki.body);
        
        if(err || markdownWiki == null){
          res.redirect(404, "/");
        } else {
          res.render("wikis/show", {markdownWiki});
        }
      })
  },

  destroy(req, res, next){
    wikiQueries.deleteWiki(req, (err, wiki) => {
      if(err){
        res.redirect(500, `/wikis/${req.params.id}`)
      } else {
        res.redirect(303, `/wikis`)
      }
    })
  },

  edit(req, res, next){
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null){
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, wiki).edit();

        if (authorized) {
          userQueries.getAllUsers((err, users) => {
            if(err) {
              res.redirect(500, `/wikis/${req.params.id}/edit`);
            } else {
              res.render("wikis/edit", {wiki, users});
            }
          })
        } else {
          req.flash("You are not authorized to do that.")
          res.redirect(`/wikis/${req.params.id}`)
        }
      }
    })
  },

  update(req, res, next){
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if(err || wiki == null){
        res.redirect(401, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    })
  }
}