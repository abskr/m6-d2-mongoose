import express from 'express'

import ArticleModel from './schema.js'

const articlesRouter = express.Router()

articlesRouter.get('/', async (req, res, next) => {
  try {
    const articles = await ArticleModel.find()
    res.send(articles)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

articlesRouter.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id
    const article = await ArticleModel.findById(id)
    if(article){
      res.send(article)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

articlesRouter.post('/', async (req, res, next) => {
  try {
    const newArticle = new ArticleModel(req.body)
    const {_id} = await newArticle.save()
    res.status(201).send('Data is saved!')
  } catch (error) {
    console.log(error)
    next(error)
  }
})

articlesRouter.put('/:id', async(req, res, next) => {
  try {
    const article = await ArticleModel.findByIdAndUpdate(req.params.id, req.body, {runValidators: true, new: true})
    if(article){
      res.send(article)
    } else {
      const error = new Error(`UserId ${req.params.id} is not found!`)
      error.httpStatusCOde = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

articlesRouter.delete('/:id', async (req, res, next) => {
  try {
    const article = await ArticleModel.findByIdAndDelete(req.params.id)
    if(article) {
      res.send(`${req.params.id} is deleted!`)
    } else {
      res.status(404).send(`User with id ${req.params.id} not found`)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default articlesRouter