const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;
const Collaborator = require("../../src/db/models").Collaborator;

describe("collaborator", () => {

  beforeEach((done) => {
    this.user;
    this.wiki;
    this.collaborator;

    sequelize.sync({force: true}).then((res) => {

      User.create({
        username: "megama",
        email: "megaman@capcom.com",
        password: "pewpewpew"
      })
      .then((res) => {
        this.user = res;

        Wiki.create({
          title: "Lorem Ipsum",
          body: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
          private: true,
          userId: this.user.id
        })
        .then((res) => {
          this.wiki = res;
          done();
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      })
    })
  })

  describe("#create()", () => {
    it("should add a user to a wiki as a collaborator", (done) => {
      Collaborator.create({
        value: 1,
        wikiId: this.wiki.id,
        userId: this.user.id
      })
      .then((collaborator) => {
        expect(collaborator.value).toBe(1);
        expect(collaborator.wikiId).toBe(this.wiki.id);
        expect(collaborator.userId).toBe(this.user.id);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      })
    })
  })

    describe("#destroy()", () => {
      it("should remove a user from a wiki as a collaborator", (done) => {
        Collaborator.create({
          value: 1,
          wikiId: this.wiki.id,
          userId: this.user.id
        })
        .then((collaborator) => {
          expect(collaborator.value).toBe(1);
          expect(collaborator.wikiId).toBe(this.wiki.id);
          expect(collaborator.userId).toBe(this.user.id);

          Collaborator.findById(collaborator.id)

          .then((collaborator) => {
            collaborator.destroy()

            .then((collaborator) => {
              expect(collaborator.value).toBe(undefined);
              done();
            })
          })
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      })
    })
  
    describe("#getUser()", () => {
      it("should return the associated user", (done) => {
        Collaborator.create({
          value: 1,
          wikiId: this.wiki.id,
          userId: this.user.id
        })
        .then((collaborator) => {
          collaborator.getUser()
          .then((user) => {
              expect(user.id).toBe(this.user.id);
              done();
          })
        })
        .catch((err) => {
          console.log(err);
          done();
        })
      })
    })
})
