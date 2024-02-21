const { Schema, model } = require('mongoose')

const UserSchema = new Schema({
  user: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  status: { type: String, default: 'user' },
})

module.exports = model('User', UserSchema)
