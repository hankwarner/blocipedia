const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');

module.exports = {
    signUp(req, res, next){
      res.render("users/signup");
    },
    
    signInForm(req, res, next){
        res.render("users/signin");
    },
 
    create(req, res, next){
        let newUser = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConfirmation: req.body.passwordConfirmation
        };

        userQueries.createUser(newUser, (err, user) => {
            const msg = {
                to: req.body.email,
                from: 'noreply@blocipedia.com',
                subject: 'Thanks for joining Blocipedia',
                text: 'Thanks for registering for your free account with Blocipedia!',
                html: '<strong>Thanks for registering for your free account with Blocipedia!</strong>',
            };

            if(err){
                req.flash("error", err);
                res.redirect("/users/signup");
            } else {
                passport.authenticate("local")(req, res, () => {
                    req.flash("notice", "You've successfully signed in!");
                    sgMail.setApiKey('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');
                    sgMail.send(msg);
                    res.redirect("/");
                })
            }
        })
    },

    signIn(req, res, next){
        passport.authenticate("local")(req, res, function () {
          if(!req.user){
            req.flash("notice", "Sign in failed. Please try again.")
            res.redirect("/users/signin");
          } else {
            req.flash("notice", "You've successfully signed in!");
            res.redirect("/");
          }
        })
    },

    signOut(req, res, next){
        req.logout();
        req.flash("notice", "You've successfully signed out!");
        res.redirect("/");
    }

  }