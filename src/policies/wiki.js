const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  new() {
    if (this.user.id) {
        return true
    }
  }

  create() {
    return this.new();
  }

  edit() {
    if (this.user.id) {
        return true
    }
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}