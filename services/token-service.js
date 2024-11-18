const { prisma } = require('../prisma/prisma-client')
const jwt = require('jsonwebtoken')

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '60m' })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
    return {
      accessToken,
      refreshToken,
    }
  }

  //=======================================================================================================
  validateAccessToken(token) {
    try {
      const tokenData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
      return tokenData
    } catch (e) {
      return null
    }
  }

  //=========================================================================================================
  validateRefreshToken(token) {
    try {
      const tokenData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
      return tokenData
    } catch (e) {
      return null
    }
  }

  //========================================================================================================
  async saveToken(userId, refreshToken) {
    try {
      const tokenData = await prisma.token.upsert({
        where: { userId },
        update: { refreshToken },
        create: { refreshToken, userId },
      })
      return tokenData
    } catch (e) {}
  }

  //=====================================================================================================
  async removeToken(refreshToken) {
    try {
      const tokenData = await prisma.token.delete({
        where: { refreshToken },
      })
      return tokenData
    } catch (e) {}
  }

  //=====================================================================================================
  async findToken(refreshToken) {
    try {
      const tokenData = await prisma.token.findUnique({
        where: { refreshToken },
      })
      return tokenData
    } catch (e) {}
  }
}

module.exports = new TokenService()
