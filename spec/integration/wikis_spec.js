const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000";

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

  describe("standard user performing CRUD actions for Wiki", () => {
    beforeEach((done) => {
      User.create({
        username: "solidsnake",
        email: "solidsnake@example.com",
        password: "metalgearsolid",
        role: 0
      })
      .then((user) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,
            userId: user.id,
            email: user.email,
            username: user.username
          }
        },
          (err, res, body) => {
            done();
          }
        )
      })
    })

    describe("GET /wikis/new", () => {
      it("should render a new wiki form", (done) => {
        request.get(`${base}/wikis/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        })
      })
    })

    describe("POST /wikis/create", () => {
      it("should create a new wiki and redirect", (done) => {
          const options = {
              url: `${base}/wikis/create`,
              form: {
                title: "Lorem Ipsum",
                body: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
                private: false,
                userId: this.user.id
              }
          };
        request.post(options,
          (err, res, body) => {

            Wiki.findOne({where: {title: "Lorem Ipsum"}})
            .then((wiki) => {
              expect(wiki).not.toBeNull();
              expect(wiki.title).toBe("Lorem Ipsum");
              expect(wiki.body).toBe("Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...");
              expect(wiki.private).toBe(false);
              expect(wiki.userId).not.toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            })
          }
        )
      })
    })

    describe("GET /wikis/:id", () => {
      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}/wikis/${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Lorem Ipsum");
          done();
        })
      })
    })

    describe("POST /wikis/:id/destroy", () => {
      it("should delete the wiki with the associated ID", (done) => {
        expect(this.wiki.id).toBe(1);
        request.post(`${base}/wikis/${this.wiki.id}/destroy`, (err, res, body) => {
          Wiki.findById(1)
          .then((wiki) => {
            expect(err).toBeNull();
            expect(wiki).toBeNull();
            done();
          })
        })
      })
    })

    describe("GET /wikis/:id/edit", () => {
      it("should render a view with an edit wiki form", (done) => {
        request.get(`${base}/wikis/${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Lorem Ipsum");
          done();
        })
      })
    })

    describe("POST /wikis/:id/update", () => {
      it("should return a status code 302", (done) => {
        request.post({
          url: `${base}/wikis/${wiki.id}/update`,
          form: {
            title: "There is no spoon",
            body: "it is not the spoon that bends, it is only yourself.",
            private: false,
            userId: this.user.id
          }
        }, (err, res, body) => {
          expect(res.statusCode).toBe(302);
          done();
        })
      })

      it("should update the wiki with the given values", (done) => {
          const options = {
            url: `${base}/wikis/${this.wiki.id}/update`,
            form: {
              title: "There is no spoon"
            }
          };
          request.post(options,
            (err, res, body) => {

            expect(err).toBeNull();

            Wiki.findOne({
              where: {id: this.wiki.id}
            })
            .then((wiki) => {
              expect(wiki.title).toBe("There is no spoon");
              done();
            })
          })
      })
    })
  })

  describe("admin user performing CRUD actions for Wiki", () => {
    beforeEach((done) => {
      User.create({
        username: "solidsnake",
        email: "solidsnake@example.com",
        password: "metalgearsolid",
        role: 2
      })
      .then((user) => {
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            role: user.role,
            userId: user.id,
            email: user.email,
            username: user.username
          }
        },
          (err, res, body) => {
            done();
          }
        )
      })
    })

    describe("GET /wikis/new", () => {
      it("should render a new wiki form", (done) => {
        request.get(`${base}/wikis/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        })
      })
    })

    describe("POST /wikis/create", () => {
      it("should create a new wiki and redirect", (done) => {
          const options = {
              url: `${base}/wikis/create`,
              form: {
                title: "Lorem Ipsum",
                body: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...",
                private: false,
                userId: this.user.id
              }
          };
        request.post(options,
          (err, res, body) => {

            Wiki.findOne({where: {title: "Lorem Ipsum"}})
            .then((wiki) => {
              expect(wiki).not.toBeNull();
              expect(wiki.title).toBe("Lorem Ipsum");
              expect(wiki.body).toBe("Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...");
              expect(wiki.private).toBe(false);
              expect(wiki.userId).not.toBeNull();
              done();
            })
            .catch((err) => {
              console.log(err);
              done();
            })
          }
        )
      })
    })

    describe("GET /wikis/:id", () => {
      it("should render a view with the selected wiki", (done) => {
        request.get(`${base}/wikis/${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Lorem Ipsum");
          done();
        })
      })
    })

    describe("POST /wikis/:id/destroy", () => {
      it("should delete the wiki with the associated ID", (done) => {
        expect(this.wiki.id).toBe(1);
        request.post(`${base}/wikis/${this.wiki.id}/destroy`, (err, res, body) => {
          Wiki.findById(1)
          .then((wiki) => {
            expect(err).toBeNull();
            expect(wiki).toBeNull();
            done();
          })
        })
      })
    })

    describe("GET /wikis/:id/edit", () => {
      it("should render a view with an edit wiki form", (done) => {
        request.get(`${base}/wikis/${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Lorem Ipsum");
          done();
        })
      })
    })

    describe("POST /wikis/:id/update", () => {
      it("should return a status code 302", (done) => {
        request.post({
          url: `${base}/wikis/${wiki.id}/update`,
          form: {
            title: "There is no spoon",
            body: "it is not the spoon that bends, it is only yourself.",
            private: false,
            userId: this.user.id
          }
        }, (err, res, body) => {
          expect(res.statusCode).toBe(302);
          done();
        })
      })

      it("should update the wiki with the given values", (done) => {
          const options = {
            url: `${base}/wikis/${this.wiki.id}/update`,
            form: {
              title: "There is no spoon"
            }
          };
          request.post(options,
            (err, res, body) => {

            expect(err).toBeNull();

            Wiki.findOne({
              where: {id: this.wiki.id}
            })
            .then((wiki) => {
              expect(wiki.title).toBe("There is no spoon");
              done();
            })
          })
      })
    })
  })

})
