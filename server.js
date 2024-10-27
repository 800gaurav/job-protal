import express from 'express'
const app = express()
import env from 'dotenv'
import cors from 'cors'
import dbconnect from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import applicationRoutes from './routes/applicationRoutes.js'
// import toRoutes from './routes/toRoutes.js'
// import blogRoutes from './routes/blogRoute.js'


env.config()
dbconnect()

app.use((cors()))
app.use(express.json())


app.use("/uploads",express.static('uploads'))

app.use('/api/auth', authRoutes)
app.use('/api/application', applicationRoutes)
// app.use('/api/blog', blogRoutes)


app.get('/',(req, res)=>{
    res.send("server start")
});

const Port = process.env.PORT || 5252

app.listen(Port, ()=>{
    console.log("port connected")
})

