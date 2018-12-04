const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/topics";

const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("routes : wikis", () => {
  beforeEach((done) => {
    this.user;
    this.wiki;
    sequelize.sync({force: true}).then((res) => {

        User.create({
            username: "megaman",
            email: "megaman@capcom.com",
            password: "pewpewpew"
        })
        .then((user) => {
            this.user = user;

            Wiki.create({
                title: "Chill Penguin",
                body: "Worst boss ever?",
                private: false,
                userId: this.user.id
            })
            .then((wiki) => {
                this.wiki = wiki;
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            })
        })
    })
  })

})
