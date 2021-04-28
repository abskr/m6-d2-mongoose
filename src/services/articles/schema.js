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
    author: {
      name: {
        type: String,
        required: true
      },
      img: String
    },
    cover: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
    reviews: [{
      text: String,
      user: String
    },{timestamps: true}]
    },
    {timestamps: true}
  )

export default model("Articles", ArticleSchema)