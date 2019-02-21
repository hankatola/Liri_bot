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
    let φ = ''
    φ += '\r\n-------------------------------------------------------'
    φ += '\r\nSearching Spotify for ' + str
    φ += '\r\n-------------------------------------------------------\r\n'
    spotify.search({type: 'track', query: str}, (err,song)=>{
        if (err) return console.log('Error: ' + err)
        let μ = song.tracks.items
        for (let i in μ) {
            φ += '\r\n---------------------------------------\r\n'
            φ += '\r\nArtist:       ' + μ[i].album.artists[0].name
            φ += '\r\nSong Title:   ' + μ[i].name
            φ += '\r\nAlbum:        ' + μ[i].album.name
            φ += '\r\nPreview Link: ' + μ[i].external_urls.spotify + '\r\n'
        }
        φ += '\r\n---------------------------------------\r\n'
        log(φ)
    })
}
const callMovie = (str)=>{
    let φ = ''
    φ += '\r\n-------------------------------------------------------'
    φ += '\r\nSearching OMDB for ' + str
    φ += '\r\n-------------------------------------------------------\r\n'
    let url = "http://www.omdbapi.com/?t=" + str + "&y=&plot=short&apikey=trilogy"
    axios.get(url).then((movie)=>{
        φ += '\r\n---------------------------------------\r\n'
        φ += '\r\nTitle:            ' + movie.data.Title
        φ += '\r\nYear:             ' + movie.data.Year
        φ += '\r\nIMDB Rating:      ' + movie.data.imdbRating
        φ += '\r\nRotten Tomatoes:  ' + movie.data.Ratings[1].Value
        φ += '\r\nCountry Produced: ' + movie.data.Country
        φ += '\r\nLanguage:         ' + movie.data.Language
        φ += '\r\nPlot:             ' + movie.data.Plot
        φ += '\r\nActors:           ' + movie.data.Actors + '\r\n'
        φ += '\r\n---------------------------------------\r\n'
        log(φ)
    })
}
const callBands = (str)=>{
    let φ = ''
    φ += '\r\n-------------------------------------------------------'
    φ += '\r\nSearching BandsinTown for ' + str
    φ += '\r\n-------------------------------------------------------\r\n'
    let url = "https://rest.bandsintown.com/artists/" + str + "/events?app_id=codingbootcamp"
    axios.get(url).then((band)=>{
        let  d = band.data
        for (let i in d) {
            φ += '\r\n---------------------------------------\r\n'
            φ += '\r\nVenue:      ' + d[i].venue.name
            φ += '\r\nLocation:   ' + d[i].venue.city + ', ' + d[i].venue.region + ' ' + d[i].venue.country
            φ += '\r\nEvent Date: ' + moment(d[i].datetime).format('MM/DD/YYYY') + '\r\n'
        }
        φ += '\r\n---------------------------------------\r\n'
        log(φ)
    })
}
const readFile = (cmd)=>{
    cmd = cmd || 'random.txt'
    fs.readFile(cmd,'utf8',(err,data)=>{
        if (err) return readFile('random.txt')
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
const log = (φ)=>{
    console.log(φ)
    fs.appendFile('log.txt',φ,(err)=> {
        console.log('Error: ' + err)
    })
}
const main = (cmd,str)=>{
    if (!cmd) cmd = 'x'
    let c = cmd[0].toLowerCase()
    if (c === 'c') {
        callBands(str)
    } else if (c === 's') {
        callMusic(str)
    } else if (c === 'm') {
        callMovie(str)
    } else {
        readFile(cmd)
    }
}


/*
    Program body
    ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
*/
main(cmd,str)