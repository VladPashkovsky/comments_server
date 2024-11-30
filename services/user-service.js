const { prisma } = require('../prisma/prisma-client')
const bcrypt = require('bcrypt')
const ApiError = require('../exeptions/api-errors')
const jwt = require('jsonwebtoken')
const tokenService = require('./token-service')
const UserDto = require('../dto/user-dto')

class UserService {

  async signUp(name, password) {
    const registeredUserByName = await prisma.user.findFirst({
      where: { name },
    })

    if (registeredUserByName) {
      throw ApiError.RegisterWrongName()
    }

    const hashedPassword = await bcrypt.hash(password, 3)

    const user = await prisma.user.create({
      data: { name,  password: hashedPassword },
    })

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  //==============================================================================================

  async signIn(name, password) {

    const user = await prisma.user.findFirst({
      where: { name },
    })

    // const user = await prisma.user.findUnique({
    //   where: { name },
    // })

    if (!user) {
      throw ApiError.LoginWrongName()
    }

    const isPassEquals = await bcrypt.compare(password, user.password)
    if (!isPassEquals) {
      throw ApiError.LoginWrongPassword()
    }

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  //==============================================================================================

  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    const userDto = new UserDto(user)
    return {user: userDto}
    // return user
  }

  //==============================================================================================

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }

    const userData = await tokenService.validateRefreshToken(refreshToken)
    const tokenFromDB = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDB) {
      throw ApiError.UnauthorizedError()
    }

    const { id } = userData
    const user = await prisma.user.findUnique({
      where: { id },
    })

    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  //==============================================================================================

  async exit(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }
}

module.exports = new UserService()
