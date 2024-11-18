const { prisma } = require('../prisma/prisma-client')
const ApiError = require('../exeptions/api-errors')

class CommentController {
  async getAllComments(req, res, next) {
    try {
      const comments = await prisma.comment.findMany()
      res.status(200).json(comments)
    } catch (e) {
      return next(ApiError.BadRequest('Failed to get list:', e.array()))
    }
  }

  async getCommentById(req, res, next) {
    const { id } = req.params
    try {
      const comment = await prisma.comment.findUnique({
        where: { id },
      })

      res.status(200).json(comment)
    } catch (e) {
      return next(ApiError.BadRequest('Error while getting data:', e.array()))
    }
  }

  async addComment(req, res, next) {
    try {
      const { text } = req.body
      if (!text) {
        return res.status(400).json({ message: 'No text...' })
      }

      const comment = await prisma.comment.create({
        data: {
          ...req.body,
          userId: req.user.id,
          userName: req.user.name,
        },
      })

      return res.status(201).json(comment)
    } catch (e) {
      return next(ApiError.BadRequest('Error while getting data:', e.array()))
    }
  }

  async editComment(req, res, next) {
    try {
      const { id } = req.params

      await prisma.comment.update({
        where: { id },
        data: { ...req.body },
      })

      return res.status(204).json('OK')
    } catch (e) {
      return next(ApiError.BadRequest('Error while getting data:', e.array()))
    }
  }

  async removeComment(req, res, next) {
    try {
      const { id } = req.params
      await prisma.comment.delete({
        where: { id },
      })

      return res.status(204).json('OK')
    } catch (e) {
      return next(ApiError.BadRequest('Error while removing data:', e.array()))
    }
  }
}

module.exports = new CommentController()
