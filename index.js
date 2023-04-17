const express = require('express');
const app = express()
const PORT = 3000;

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (req, res) => {
    res.render('home')
})
app.post('/', (req, res) => {
    console.log(req.body)
})

app.listen(PORT, () => {
    console.log(`app listening in http://localhost:${PORT}`)
})