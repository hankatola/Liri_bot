/*
    Global Variables
    ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
*/

//  npm modules
//  ‾‾‾‾‾‾‾‾‾‾‾‾
require("dotenv").config()
const keys = require("./keys.js")
const Spotify = require('node-spotify-api')
const moment = require('moment')
const axios = require('axios')
const spotify = new Spotify(keys.spotify)
const fs = require('fs')

//  other variables
//  ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
let cmd = process.argv[2]
let str = process.argv.slice(3).join(' ')


/*
    Function Farm
    ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
*/
const callMusic = (str)=>{
    console.log('\n---------------------------------------')
    console.log('Searching Spotify for ' + str)
    console.log('---------------------------------------\n')
    spotify.search({type: 'track', query: str}, (err,song)=>{
        if (err) return console.log('Error: ' + err)
        let μ = song.tracks.items
        for (let i in μ) {
            let φ = μ[i].album.artists[0]
            console.log('---------------------------------------\n')
            console.log('Artist:       ' + μ[i].album.artists[0].name)
            console.log('Song Title:   ' + μ[i].name)
            console.log('Album:        ' + μ[i].album.name)
            console.log('Preview Link: ' + μ[i].external_urls.spotify)
            console.log()
        }
        console.log('---------------------------------------\n')
    })
}
const callMovie = (str)=>{
    console.log('\n---------------------------------------')
    console.log('Searching OMDB for ' + str)
    console.log('---------------------------------------\n')
    let url = "http://www.omdbapi.com/?t=" + str + "&y=&plot=short&apikey=trilogy"
    axios.get(url).then((movie)=>{
        // console.log(JSON.stringify(movie.data,null,2))
        console.log('---------------------------------------\n')
        console.log('Title:            ' + movie.data.Title)
        console.log('Year:             ' + movie.data.Year)
        console.log('IMDB Rating:      ' + movie.data.imdbRating)
        console.log('Rotten Tomatoes:  ' + movie.data.Ratings[1].Value)
        console.log('Country Produced: ' + movie.data.Country)
        console.log('Language:         ' + movie.data.Language)
        console.log('Plot:             ' + movie.data.Plot)
        console.log('Actors:           ' + movie.data.Actors + '\n')
        console.log('---------------------------------------\n')
    })
}
const callBands = (str)=>{
    console.log('\n---------------------------------------')
    console.log('Searching BandsinTown for ' + str)
    console.log('---------------------------------------\n')
    let url = "https://rest.bandsintown.com/artists/" + str + "/events?app_id=codingbootcamp"
    axios.get(url).then((band)=>{
        // console.log(JSON.stringify(band.data,null,2))
        let  d = band.data
        for (let i in d) {
            console.log('---------------------------------------\n')
            console.log('Venue:      ' + d[i].venue.name)
            console.log('Location:   ' + d[i].venue.city + ', ' + d[i].venue.region + ' ' + d[i].venue.country)
            console.log('Event Date: ' + moment(d[i].datetime).format('MM/DD/YYYY') + '\n')
        }
        console.log('---------------------------------------\n')
    })
}
const readFile = (str) => {
    str = str || 'random.txt'
    fs.readFile(str,'utf8',(err,data)=>{
        if (err) return console.log('Error: ' + err)
        if (data.includes(',')) {
            cmd = data.split(',')[0]
            str = data.split(',')[1]
        } else {
            cmd = data.split(' ')[0]
            str = []
            for (let i = 1; i < data.split(' ').length; i++) {
                str.push(data.split(' ')[i])
            }
            str = str.join(' ')
        }
        main(cmd,str)
    })
}
const main = (cmd,str)=>{
    if (!cmd) cmd = 'x'
    cmd = cmd[0].toLowerCase()
    if (cmd === 'c') {
        callBands(str)
    } else if (cmd === 's') {
        callMusic(str)
    } else if (cmd === 'm') {
        callMovie(str)
    } else {
        return readFile(str)
    }

}


/*
    Program body
    ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
*/
main(cmd,str)
