const request = require('request')
const path = require('path')
const hbs = require('hbs')

const express = require('express')
const app = express()
// allows heroku to access and set port
const port = process.env.PORT || 3000

const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// define paths for express config
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const publicDirectoryPath = path.join(__dirname, '../public')

// setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirectoryPath))

// app.com
// app.com/help
// app.com/about

// what should the server do when someone tries to get the resource at a specific url (html or json?)
    // first argument is the route (empty for homepage), second is what express should do
//app.get('', (req, res) => {
//    res.send('<h1>Weather</h1>')
//})

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Tommy'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'about',
        name: "Tommy"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'help',
        message: "Come here if you need help!",
        name: 'Tommy'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error: 'You must provide an address!'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {

        if(error) {
            return res.send({
                error
            })
        }

        forecast(longitude, latitude, (error, forecastData) => {
    
            if(error) {
                return res.send({
                    error
                })
            }
    
            
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

// format for query strings: "?key=value&key=value"

app.get('/help/*', (req, res) => {
    res.render('404-help')
})

app.get('*', (req, res) => {
    res.render('404')
})

app.listen(port, () => {
    console.log('server is up on port ' + port)
})