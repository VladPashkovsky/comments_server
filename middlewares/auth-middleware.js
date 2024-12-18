const ApiError = require('../exeptions/api-errors')
const tokenService = require('../services/token-service')
const { prisma } = require('../prisma/prisma-client')

module.exports = async function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError())
    }

    const accessToken = authorizationHeader.split(' ')[1]
    if (!accessToken) {
      return next(ApiError.UnauthorizedError())
    }

    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) {
      return next(ApiError.UnauthorizedError())
    }

    const { id } = userData
    const user = await prisma.user.findUnique({
      where: { id },
    })

    req.user = user
    next()
  } catch (e) {
    // return ApiError.UnauthorizedError()
    return next(ApiError.UnauthorizedError());
  }
}
