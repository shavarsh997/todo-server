const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
  async login(user, password) {
    const data = await UserModel.findOne({ user })
    if (!data) {
      throw ApiError.BadRequest('User was not found')
    }
    const isPassEquals = await bcrypt.compare(password, data.password)
    if (!isPassEquals) {
      throw ApiError.BadRequest('Wrong password')
    }
    const userDto = new UserDto(data)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  async register(user, password) {
    const data = await UserModel.findOne({ user })

    if (data) {
      throw ApiError.BadRequest("This user already exists'")
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const newUser = new UserModel({
      user: user,
      password: hashedPassword,
    })

    await newUser.save()
    const userData = await UserModel.findOne({ user })

    const userDto = new UserDto(userData)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }
    const user = await UserModel.findById(userData.id)
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }
}

module.exports = new UserService()
