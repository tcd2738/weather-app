const request = require('request')

const forecast = (longitude, latitude, callback) => {
    const url = 'https://api.darksky.net/forecast/985f21af8b755ff7d413f53aae0589be/'
     + encodeURIComponent(latitude) + ',' + encodeURIComponent(longitude)

     request({url, json: true}, (error, {body}) =>{
        if (error) {
            callback('Unable to connect to weather service.', undefined)
        } else if (body.error) {
            callback('Unable to find location.', undefined)
        }
        else {
            callback(undefined, {
                summary: body.daily.data[0].summary,
                temperature: body.currently.temperature,
                precipProbability: body.currently.precipProbability
            })
        }
     })
}

module.exports = forecast
