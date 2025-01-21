const { prisma } = require('../prisma/prisma-client')
const ApiError = require('../exeptions/api-errors')

class CommentController {
  async getAllComments(req, res, next) {
    try {
      const { userId, _page, _per_page } = req.query;
      const page = parseInt(_page) || 1;
      const perPage = parseInt(_per_page) || 5;
      const skip = (page - 1) * perPage;

      const where = userId ? { userId: userId } : {};

      const [comments, totalCount] = await Promise.all([
        prisma.comment.findMany({
          where,
          skip,
          take: perPage,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.comment.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / perPage);
      const nextPage = page < totalPages ? page + 1 : null;

      res.status(200).json({
        data: comments,
        meta: {
          totalCount,
          pageCount: totalPages,
          currentPage: page,
          perPage,
        },
        next: nextPage,
      });
    } catch (e) {
      return next(ApiError.BadRequest('Failed to get list:', e.message));
    }
  }

  // async getAllComments(req, res, next) {
  //   try {
  //     const comments = await prisma.comment.findMany()
  //     res.status(200).json(comments)
  //   } catch (e) {
  //     return next(ApiError.BadRequest('Failed to get list:', e.array()))
  //   }
  // }

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
