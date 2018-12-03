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
                    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                    sgMail.send(msg);
                    res.redirect("/");
                })
            }
        })
    }
  }