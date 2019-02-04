# Blocipedia

Wikis are a great way to collaborate on community-sourced content. Blocipedia is an app that lets users create their wikis and share them publicly or privately with other collaborators. 

## Getting Started

This app is hosted on Heroku and can be found [here](https://hankwarner-blocipedia.herokuapp.com/ "Blocipedia Homepage").


### User Sign-Up

First time users should start by visiting the registration page by clicking the 'Sign Up' link in the navigation bar or clicking the button below the landing page image. 

Enter a username, email and password and registration is complete. On successful sign-up, you will receive a flash message as well as a confirmation email. You're now registered as a basic member of the Blocipedia community and can view and comment on public wikis.

If you would like to view, create and edit private wikis, upgrade to a premium membership. Start by selecting 'View Profile' from the navigation bar. Then click the 'Pay with Card' button to access the credit card wiget (courtesy of Stripe's API). Enter your credit card information (note: _use credit card number 4242 4242 4242 4242 and any expiration date and security code to test the API_). You will receive a flash message as well as a confirmation email to confirm your upgrade to a premium account. You can now view, create comment on private wikis.


### View Wikis

Click the 'Wikis' link in the navigation bar to view the wiki board. Wikis are sorted to show the most recently created/edited wikis at the top. Basic members will only be able to see the Public Wikis section, and Premium members will see an additional section called Private Wikis. Additionally, all signed-in users will see a section titled 'Collaborting on:' which displays any wikis which you are listed as a collaborator.


### Create a Wiki

Signed in users will see a green 'New Wiki' button on the wikis index view. Click it to get started. Basic members will see a Title and Body field in which to write their wiki content, and Premium members will see two additional input fields: 'Make Private' and 'Add Collaborator'. The 'Add Collaborator' input is a dropdown containing all of the site's users. Premium members are allowed to add Basic members as collaborators on private wikis, and the Basic user will then be able to view and edit it. 

**Wikis are Markdown compatible**. Spice up your wiki using Markdown syntax to add rich text. 

### Search
Use the search tool in the top right corner of the navigation bar to search for wikis by title.


## Testing
Unit and integration tests are provided by Jasmine and can be found in the `spec` folder


## npm Packages/Dependancies:
For a full list of dependancies, visit the `package.json` file. Highlights include:

* PostgreSQL for modeling data in a relational database.
* Sequelize, a promise-based ORM, to handle tasks such as defining models, setting up associations between models, and generating migrations.
* Express for routing and handling middleware.
* Stripe to charge users before switching their account role from standard to premium.
* EJS (Embedded JavaScript) is the templating engine which renders the client view. It uses JavaScript to generate HTML using simple syntax with fast compilation and rendering times.
* Passport for user authentication. Bloccit implements a stateful session-based authentication system using cookies.
* Bcrypt for encrypting user passwords.
* dotenv for storing environment variables and sensitive API keys.
* Faker for providing the lovely seed data that you see in the production environment.
