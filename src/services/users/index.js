import express from "express"

import UserModel from "./schema.js"

const usersRouter = express.Router()

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find()
    res.send(users)
  } catch (error) {
    next(error)
  }
})

usersRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const user = await UserModel.findById(id)
    if (user) {
      res.send(user)
    } else {
      const error = new Error('User not found!')
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading users list a problem occurred!")
  }
})

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body)
    const { _id } = await newUser.save()

    res.status(201).send(_id)
  } catch (error) {
    next(error)
  }
})

usersRouter.put("/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    })
    if (user) {
      res.send(user)
    } else {
      const error = new Error(`User with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id)
    if (user) {
      res.send(`${req.params.id} is deleted`)
    } else {
      // const error = new Error(`User with id ${req.params.id} not found`)
      // error.httpStatusCode = 404
      // next(error)
      res.status(404).send(`User with id ${req.params.id} not found`)
    }
  } catch (error) {
    next(error)
  }
})

export default usersRouter
