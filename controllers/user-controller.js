const userService = require('../service/user-service')
const taskService = require('../service/task-service')
const ApiError = require('../exceptions/api-error')

class UserTaskController {
  async login(req, res, next) {
    try {
      const { user, password } = req.body
      const { accessToken, refreshToken } = await userService.login(
        user,
        password,
      )

      res.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      return res.json({ accessToken })
    } catch (e) {
      next(e)
    }
  }

  async register(req, res, next) {
    try {
      const { user, password } = req.body
      const { accessToken, refreshToken } = await userService.register(
        user,
        password,
      )

      res.cookie('refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      })

      return res.json({ accessToken })
    } catch (e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies

      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(token)
    } catch (e) {
      next(e)
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = req.params.link

      await userService.activate(activationLink)
      return res.redirect(process.env.CLIENT_URL)
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
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async getTasks(req, res, next) {
    try {
      let { id } = req.user
      const data = await taskService.getTasks(id)
      return res.json(data)
    } catch (e) {
      next(e)
    }
  }

  async setTasks(req, res, next) {
    try {
      const { title, description } = req.body
      const { id } = req.user

      const data = await taskService.setTasks(title, description, id)

      return res.json(data)
    } catch (e) {
      next(e)
    }
  }

  async isValidToken(req, res, next) {
    try {
      const { id } = req.user
      if (id) {
        return res.json({ user: 'Authorization is correct' })
      } else {
        throw ApiError.BadRequest('You are not an admin')
      }
    } catch (e) {
      next(e)
    }
  }

  async updateUserStatus(req, res, next) {
    try {
      const { id } = req.params
      const { status } = req.body
      const user = req.user

      const data = await taskService.updateUserStatus(id, status, user.id)

      return res.json({ data })
    } catch (e) {
      next(e)
    }
  }

  async deleteUserTaskData(req, res, next) {
    try {
      const { id } = req.params
      const user = req.user
      const data = await taskService.deleteUserTaskData(id, user.id)

      return res.json({ data })
    } catch (e) {
      next(e)
    }
  }

  async updateUserTask(req, res, next) {
    try {
      const { id } = req.params
      const { title, description } = req.body
      const user = req.user

      const data = await taskService.updateUserTask(
        id,
        title,
        description,
        user.id,
      )

      return res.json({ data })
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserTaskController()
