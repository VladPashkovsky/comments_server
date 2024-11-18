module.exports = class ApiError extends Error {
  status
  errors

  constructor(status, message, errors = []) {
    super(message)
    this.status = status
    this.errors = errors
  }

  static UnauthorizedError() {
    return new ApiError(401, 'User is not authorized')
  }

  static BadRequest(message, errors = []) {
    return new ApiError(400, message, errors)
  }

  static RegisterWrongName() {
    return new ApiError(400, 'User with this name already exists')
  }

  static RegisterWrongEmail() {
    return new ApiError(400, 'User with this email already exists')
  }

  static LoginWrongName() {
    return new ApiError(500, 'Wrong name')
  }

  static LoginWrongPassword() {
    return new ApiError(500, 'Wrong password')
  }
}
