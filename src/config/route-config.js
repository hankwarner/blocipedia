const userRoutes = require("../routes/users");
const wikiRoutes = require("../routes/wikis");

module.exports = {
    init(app){
      const staticRoutes = require("../routes/static");
      
      app.use(staticRoutes);
      app.use(userRoutes);
      app.use(wikiRoutes);
    }
  }