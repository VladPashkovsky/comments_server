module.exports = class UserDto {
  // email
  name
  id
  isActivated
  image

  constructor(model) {
    // this.email = model.email
    this.name = model.name
    this.id = model.id
    this.isActivated = model.isActivated
    this.image = model.image
  }
}
