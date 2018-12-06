const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {

  new() {
    if (this.user.isAdmin() || this.user.isStandard()) {
        return true
    }
  }

  create() {
    return this.new();
  }

  edit() {
    if (this.user.isAdmin() || this.user.isStandard()) {
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