import express from 'express'
import cors from 'cors'
import listEndpoints from 'express-list-endpoints'
import mongoose from 'mongoose'

import articlesRouter from './services/articles/index.js'
import authorsRouter from './services/authors/index.js'
import usersRouter from './services/users/index.js'

import { notFoundErrorHandler, badRequestErrorHandler, forbiddenErrorHandler,catchAllErrorHandler} from './errorHandler.js'

const server = express()

const port = process.env.PORT || 3001

server.use(express.json())

server.use(cors())

server.use('/articles', articlesRouter)
server.use('/authors', authorsRouter)
server.use('/users', usersRouter)

//ERROR HANDLERS
server.use(badRequestErrorHandler)
server.use(notFoundErrorHandler)
server.use(forbiddenErrorHandler)
server.use(catchAllErrorHandler)

console.log(listEndpoints(server));

mongoose.connect(process.env.MONGO_CONNECTION || 'mongodb+srv://aabskr:XBtCpfCh4u4WNJgh@test1.yywbm.mongodb.net/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
}).then(
  server.listen(port, () => {
    console.log('Running on port: ', port)
  })
).catch(err => console.log(err))
