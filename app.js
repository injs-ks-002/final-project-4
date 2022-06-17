const express = require('express')
const app = express()
const port = 3000
const userRouter = require('./routes/user.js');
const photoRouter = require('./routes/photo');
const commentRouter = require('./routes/comment.route');
const socialMediaRouter = require('./routes/socialmedia.route')

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/users", userRouter);
app.use("/photo", photoRouter);
app.use('/comments', commentRouter)
app.use('/socialmedias', socialMediaRouter)

app.listen(port, function () {
    console.log(`Server running on http://localhost:${port}`)
})