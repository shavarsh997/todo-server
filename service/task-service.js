const TaskModal = require('../models/task-model')

class TaskService {
  async getTasks(id) {
    const tasks = await TaskModal.find({ user: id })

    return tasks
  }

  async setTasks(title, description, id) {
    const newTask = await TaskModal.create({
      title,
      description,
      user: id,
    })
    return newTask
  }

  async updateUserStatus(id, status, userId) {
    await TaskModal.updateOne({ _id: id, user: userId }, { isDone: status })
    return { isUpdate: true }
  }

  async updateUserTask(id, title, description, userId) {
    await TaskModal.updateOne({ _id: id, user: userId }, { title, description })
    return { isUpdate: true }
  }

  async deleteUserTaskData(id, userId) {
    await TaskModal.deleteOne({ _id: id, user: userId })
    return { isUpdate: true }
  }
}

module.exports = new TaskService()
