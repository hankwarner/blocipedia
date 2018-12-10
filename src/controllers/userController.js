const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
const stripe = require("stripe")(process.env.STRIPE_TEST_API_KEY);
const inquirer = require("inquirer");

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
    },

    show(req, res, next){
        userQueries.getUser(req.params.id, (err, result) => {
            if(err || result.id === undefined){
                req.flash("notice", "No user found with that ID.");
                res.redirect("/");
            } else {
                res.render("users/show", {...result});
            }
        })
    },

    upgrade(req, res, next){
        const token = req.body.stripeToken;
        
        const charge = stripe.charges.create({
            amount: 15,
            currency: 'usd',
            description: 'Premium membership',
            source: token,
        })

        userQueries.upgradeRole(req, (err, result) => {
            if(err || result.id === undefined){
                req.flash("notice", "No user found with that ID.");
                res.redirect("users/show");
            } else {
                req.flash("notice", "Thank you for becoming a Premium member!");
                res.render("users/show", {...result});
            }
        })

    },

    downgrade(req, res, next){
        inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'toBeDelivered',
                    message: 'Is this for delivery?',
                    default: false
                }
            ])
            .then(answers => {

                const token = req.body.stripeToken;
        
                const refund = stripe.refunds.create({
                    charge: 'ch_y4T9e59zXeMAP0Fq7a04',
                    amount: 1500,
                });

                userQueries.downgradeRole(req, (err, result) => {
                    if(err || result.id === undefined){
                        req.flash("notice", "No user found with that ID.");
                        res.redirect("users/show");
                    } else {
                        req.flash("notice", "Downgraded to standard membership");
                        res.render("users/show", {...result});
                    }
                })
            })
            .catch(err => {
                console.log(err);
            })

    }

  }