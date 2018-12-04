const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;
const Wiki = require("../../src/db/models").Wiki;

describe("Wiki", () => {
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
          title: "My first visit to Proxima Centauri b",
          body: "I saw some rocks.",
          private: false,
          userId: this.user.id
        })
        .then((wiki) => {
          this.wiki = wiki;
          done();
        })
      })
      .catch((err) => {
        console.log(err);
        done();
      })
    })
  })

  describe("#create()", () => {
    it("should create a wiki object with a title, body, private boolean and associated user", (done) => {
      Wiki.create({
        title: "Lorem Ipsum",
        body: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
        private: false,
        userId: this.user.id
      })
      .then((wiki) => {
        expect(wiki.title).toBe("Lorem Ipsum");
        expect(wiki.body).toBe("Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...");
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      })
    })

    it("should not create a wiki with missing title, body, or assigned user", (done) => {
        Wiki.create({
          title: "Pros of Cryosleep during the long journey"
        })
        .then((wiki) => {
          done();
        })
        .catch((err) => {
          expect(err.message).toContain("Wiki.body cannot be null");
          expect(err.message).toContain("Wiki.userId cannot be null");
          done();
        })
    })
  })

  describe("#getUser()", () => {
    it("should return the associated user", (done) => {
      this.wiki.getUser()
      .then((associatedUser) => {
        expect(associatedUser.id).toBe(1);
        done();
      })
    })
  })

})
