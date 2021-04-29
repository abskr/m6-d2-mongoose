import express from 'express'
import mongoose from 'mongoose'
import q2m from 'query-to-mongo'

import ArticleModel from './schema.js'

const articlesRouter = express.Router()

articlesRouter.get('/', async (req, res, next) => {
  // try {
  //   // const articles = await ArticleModel.find()
  //   // res.send(articles)
  //   const query = q2m(req.query)
  //   //console.log(query)
  //   const totalArticles = await ArticleModel.countDocuments(query.criteria)
  //   // console.log(totalArticles)
    
  //   const articles = await ArticleModel.find(query.criteria, query.options.fields)
  //   .skip(query.options.skip)
  //   .limit(query.options.limit)
  //   .sort(query.options.sort)
    
  //   res.send({ links: query.links('/articles', totalArticles), articles})
  // } catch (error) {
  //   console.log(error)
  //   next(error)
  // }
  try {
    const query = q2m(req.query)
    const { articles, total } = await ArticleModel.findArticlesWithAuthors(query)
    res.send({ links: query.links('/articles', total), articles})
  } catch (error) {
    console.log(error)
    next(error)
  }
})

articlesRouter.get('/:id', async (req, res, next) => {
  // try {
  //   const id = req.params.id
  //   const article = await ArticleModel.findById(id)
  //   if(article){
  //     res.send(article)
  //   }
  // } catch (error) {
  //   console.log(error)
  //   next(error)
  // }

  try {
    const article = await ArticleModel.findArticleWithAuthors(req.params.id)
    if (article) {
      res.send(article)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
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
    res.status(201).send(`data is saved with id: ${_id}`)
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

articlesRouter.get('/:articleId/reviews', async (req, res, next) => {
  try {
    const { reviews } = await ArticleModel.findById(req.params.articleId,{ _id: 0})
    res.send(reviews)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

articlesRouter.get('/:articleId/reviews/:reviewId', async (req, res, next) => {
  try {
    const { reviews } = await ArticleModel.findOne(
      {
        _id: mongoose.Types.ObjectId(req.params.articleId)
      },
      {
        reviews: {
          $elemMatch: {
            _id: mongoose.Types.ObjectId(req.params.reviewId)
          }
        }
      }
    )

    if (reviews && reviews.length > 0) {
      res.send(reviews[0])
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

articlesRouter.post('/:articleId', async (req, res, next) => {
  try {
    // const reviewToPost = {...req.body, date: new Date()}
    const updatedArticle = await ArticleModel.findByIdAndUpdate(
      req.params.articleId,
      {
        $push: {
          reviews: req.body
      }
    },
      { runValidators: true, new:true }
    )
    res.send(updatedArticle)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

articlesRouter.put('/:articleId/reviews/:reviewId', async (req, res, next) => {
  try {
    const moddedArticle = await ArticleModel.findOneAndUpdate(
      {
        _id: mongoose.Types.ObjectId(req.params.articleId),
        "reviews._id": mongoose.Types.ObjectId(req.params.reviewId)
      },
      {
        $set: {
          'reviews.$': {
            ...req.body,
            _id: req.params.reviewId
          }
        }
      },
      {
        runValidators: true,
        new: true
      }
    )
    if (moddedArticle) {
      res.send(moddedArticle)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

articlesRouter.delete('/:articleId/reviews/:reviewId', async (req, res, next) => {
  try {
    const modifiedArticle = await ArticleModel.findByIdAndUpdate(
      req.params.articleId,
      {
        $pull: {
          reviews: 
            {
              _id: mongoose.Types.ObjectId(req.params.reviewId)
            }
        }
      },
      {new: true}
    )
    res.send(modifiedArticle)
  } catch (error) {
    console.log(error)
    next(error)
  }
})

export default articlesRouter