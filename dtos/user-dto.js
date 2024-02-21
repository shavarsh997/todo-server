module.exports = class UserDto {
  user
  id

  constructor(model) {
    this.user = model.user
    this.id = model._id
  }
}
