import 'dotenv/config.js'
import connectDB from './db/index.js'
import app from './app.js'

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("DB connection error",error.message)
})

app.get('/',(req,res)=>{
    res.send('API is running')
})