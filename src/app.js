import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app=express()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors())


import superAdminRoutes from './routes/superAdmin.routes.js'
import adminRoutes from './routes/admin.routes.js'
import judgeRoutes from './routes/judges.routes.js'
app.use('/api/v1/superAdmin',superAdminRoutes)
app.use('/api/v1/admin',adminRoutes)
app.use('/api/v1/judge',judgeRoutes)

export default app
