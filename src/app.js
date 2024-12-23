import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app=express()
const allowedOrigins = ['http://localhost:5173', 'https://err404-manager.vercel.app']

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
// app.use(cors())

app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.includes(origin)) {
        callback(null, true) // Allow this origin
      } else {
        callback(new Error('Not allowed by CORS')) // Reject other origins
      }
    },
    credentials: true // Allow credentials (cookies, authorization headers)
  })
)

import superAdminRoutes from './routes/superAdmin.routes.js'
import adminRoutes from './routes/admin.routes.js'
import judgeRoutes from './routes/judges.routes.js'
import userRoutes from './routes/user.routes.js'
app.use('/api/v1/superAdmin',superAdminRoutes)
app.use('/api/v1/admin',adminRoutes)
app.use('/api/v1/judge',judgeRoutes)
app.use('/api/v1/user',userRoutes)

export default app
