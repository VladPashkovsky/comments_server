const { validationResult } = require('express-validator')
const ApiError = require('../exeptions/api-errors')
const userService = require('../services/user-service')


class UserController {
  async register(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Invalid name or password', errors.array()))
      }

      const { name, password } = req.body

      // const svgFilePath = path.join(__dirname, 'temp.svg');
      // fs.writeFileSync(svgFilePath, image);
      //
      // const pngFilePath = path.join(__dirname, 'temp.png');
      // await convertFile(svgFilePath, {
      //   width: 128,
      //   height: 128,
      //   outputFilePath: pngFilePath,
      // });
      //
      // const png = fs.readFileSync(pngFilePath);
      //
      // fs.unlinkSync(svgFilePath);
      // fs.unlinkSync(pngFilePath);
      //
      // const params = {
      //   Bucket: process.env.S3_IMAGES_BUCKET,
      //   Key: `${name}.png`,
      //   // Body: Buffer.from(image.replace(/^data:image\/svg\+xml;base64,/, ''), 'base64'),
      //   Body: png,
      //   ContentType: 'image/png',
      // }
      //
      // const command = new PutObjectCommand(params)
      //
      // const data = await s3Client.send(command)
      //
      // const imageUrl = data.$metadata.httpStatusCode === 200 ? `${process.env.S3_ENDPOINT}/images/${name}.png` : null

      const userData = await userService.signUp(name, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async login(req, res, next) {
    try {
      const { name, password } = req.body

      const userData = await userService.signIn(name, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async uploadAvatar(req, res, next) {
    try {
      const file = req.file
      const id = req.body.id
      const imageUrl = await userService.uploadAvatar(id, file)
      return res.json(imageUrl)
    } catch (e) {
      next(e)
    }
  }

  async getUserById(req, res, next) {
    const { id } = req.params
    try {
      const user = await userService.getUserById(id)
      return res.json(user)
    } catch (e) {
      next(e)
    }
  }

  async current(req, res, next) {
    try {
      res.status(200).json(req.user)
    } catch (e) {
      next(e)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const token = await userService.exit(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(token)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController()
