// https://moviesrecord.herokuapp.com/
const movies = {
    "0":{
        "id":"0",
        "title":"Bhale Bhale Magadivoy",
        "year":"2015",
        "password":"abc123"
    },
    "1": {
        "id":"1",
        "title":"The Matrix",
        "year":"1999",
        "password":"abc123"
    },
    "2":{
        "id":"2",
        "title":"Maharshi",
        "year":"2019",
        "password":"abc123"
    },
    "3":{
        "id":"3",
        "title":"Ala Vaikunthapurramuloo",
        "year":"2020",
        "password":"abc123"
    },
    "4": {
        "id":"4",
        "title":"Saaho",
        "year":"2019",
        "password":"abc123"
    }, 
    "5":{
        "id":"5",
        "title":"Red",
        "year":"2021",
        "password":"abc123"
    }
}

const express = require('express')
const session = require('express-session')
const fileUpload = require('express-fileupload')
const expHbs = require('express-handlebars')

const app = express()
app.use(express.static('public'))
app.use(session({
    secret:"FLOW",
    resave:false,
    saveUninitialized:false
}))

app.use(fileUpload())
app.use(express.urlencoded({extended:true}))

app.engine('hbs', expHbs({extname:'hbs'}))
app.set("view engine", 'hbs')

app.get("/", (req, res) => {
    res.render("login")
})
app.get("/profile", (req, res) => {
    if (req.session.isloggedin == true) {
        res.render('profile', req.session.user)
        return
    }
    res.redirect("/login")
})

app.get("/logout", (req, res) => {
    req.session.isloggedin = false
    res.redirect("/login")
})

app.get("/login", (req, res) => {
    res.render('login')
})

app.post("/login", (req, res) => {
    let {id, password} = req.body
    let flag = false
    let user
    const keys = Object.keys(movies)
    keys.forEach((item) => {
        if (movies[item].id == id && movies[item].password == password) {
            flag = true
            user = movies[item]
            return false
        }
    })
    if (flag) {
        req.session.user = user
        req.session.isloggedin = true
        res.redirect("/profile")
        return
    }
    res.redirect("/login")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.post("/signup", (req, res) => {
    let {id, title, year, password}  = req.body
    id.trim()
    title.trim()
    year.trim()
    password.trim()
    if (id != "" && title != "" && year != "" && password != "") {
        let keys = Object.keys(movies)
        keys = keys.map(item => Number(item))
        let newId = Math.max(...keys) + 1
        if (newId < count) {
            newId = count
        }else {
            count = newId
        }
        movies[newId] = req.body
        req.session.user =  movies[newId]
        req.session.isloggedin = true
        res.redirect("/profile")

    } else {
        res.redirect("/signup")
    }
})

app.use(express.json())
let count = 6
app.get('/movies', (req, res) => {
    const keys = Object.keys(movies)
    const userArray = keys.map(id => movies[id])
    res.json(userArray)
})

app.get("/users/:id", (req, res) => {
    const { id } = req.params
    const foundUser = movies[id]
    if (foundUser == undefined) {
        res.json({success:false})
        return
    }
    let user = {"id":foundUser.id, "title":foundUser.title,"year" :foundUser.year}
    res.json(user)
})

app.post("/users", (req, res) => {
    if (req.body.title && req.body.year && req.body.password && req.body.id && Object.keys(req.body).length == 4) {
        let keys = Object.keys(movies)
        keys = keys.map(item => Number(item))
        let newId = Math.max(...keys) + 1
        if (newId < count) {
            newId = count
        }else {
            count = newId
        }
        movies[newId] = req.body
        let user = {"id":req.body.id, "title":req.body.title, "year": req.body.year}
        res.json({success: true, user})
    }
    else {
        res.json({success:false})
    }
})

app.put('/users/:id', (req, res) => {
    let {id} = req.params
    id = Number(id)
    let flag = false
    let keys = Object.keys(movies)
    keys.forEach((item) => {
        if (item == id) {
            flag = true
            return false
        }
    })
    if (id != NaN && req.body.title && req.body.year && req.body.id && req.body.password && Object.keys(req.body).length == 4 && flag) {
        movies[id].id = id
        movies[id].title = req.body.title
        movies[id].year = req.body.year
        movies[id].password = req.body.password
        let user = {"id":req.body.id, "title":req.body.title, "year": req.body.year}
        res.json({success: true, user})
    }
    else {
        res.json({success:false})
    }
})

app.delete('/users/:id', (req, res) => {
    let {id} = req.params
    const deletedObj = movies[id]
    if(deletedObj != undefined) {
        delete movies[id]
        res.json({success: true, user: deletedObj})
    }
    else {
        res.json({success:false})
    }
})

app.listen(process.env.PORT || 3000, () => console.log('Server Started'))