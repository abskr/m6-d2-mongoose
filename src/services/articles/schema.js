import mongoose from 'mongoose'

const { Schema, model } = mongoose

const ArticleSchema = new Schema(
  {
    headLine: {
      type: String,
      required: true
    },
    subHead: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    category: {
      name: {
        enum: [
          "POPULAR",
          "MOMENTUM",
          "CORONAVIRUS",
          "ONEZERO",
          "ELEMENTAL",
          "GEN",
          "ZORA",
          "FORGE",
          "HUMAN PARTS",
          "MARKER",
          "LEVEL",
          "HEATED",
        ]
      },
      img: {
          type: String,
          default: 'https://via.placeholder.com/150'
        }
    },
    authors: [{
      type: Schema.Types.ObjectId, required: true, ref: 'Author' 
    }],
    cover: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    reviews: [{
      type : new Schema(
        {
          text : {type: String, required: true},
          user : {type: String, trim: true}
        }
        // ,{
        //   timestamps: true
        // }
      )
    }]
    },
    {timestamps: true}
  )

  ArticleSchema.post('validate', function (error, doc, next){
    if (error) {
      error.errorList = error.errors
      error.httpStatusCode = 400
      next(error)
    } else {
      next()
    }
  })

  ArticleSchema.static('findArticleWithAuthors', async function (articleId) {
    const article = await this.findOne({ _id: articleId}).populate('authors')
    return article
  })

  ArticleSchema.static('findArticlesWithAuthors', async function (query) {
    const total = await this.countDocuments(query.criteria)
    const articles = await this.find(query.criteria).skip(0).limit(query.options.limit).sort(query.options.sort).populate('authors')

    return { total, articles }
  })


export default model("Articles", ArticleSchema)