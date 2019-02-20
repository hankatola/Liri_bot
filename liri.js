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
    φ += '\n-------------------------------------------------------'
    φ += '\nSearching Spotify for ' + str
    φ += '\n-------------------------------------------------------\n'
    spotify.search({type: 'track', query: str}, (err,song)=>{
        if (err) return console.log('Error: ' + err)
        let μ = song.tracks.items
        for (let i in μ) {
            φ += '\n---------------------------------------\n'
            φ += '\nArtist:       ' + μ[i].album.artists[0].name
            φ += '\nSong Title:   ' + μ[i].name
            φ += '\nAlbum:        ' + μ[i].album.name
            φ += '\nPreview Link: ' + μ[i].external_urls.spotify + '\n'
        }
        φ += '\n---------------------------------------\n'
        log(φ)
    })
}
const callMovie = (str)=>{
    let φ = ''
    φ += '\n-------------------------------------------------------'
    φ += '\nSearching OMDB for ' + str
    φ += '\n-------------------------------------------------------\n'
    let url = "http://www.omdbapi.com/?t=" + str + "&y=&plot=short&apikey=trilogy"
    axios.get(url).then((movie)=>{
        φ += '\n---------------------------------------\n'
        φ += '\nTitle:            ' + movie.data.Title
        φ += '\nYear:             ' + movie.data.Year
        φ += '\nIMDB Rating:      ' + movie.data.imdbRating
        φ += '\nRotten Tomatoes:  ' + movie.data.Ratings[1].Value
        φ += '\nCountry Produced: ' + movie.data.Country
        φ += '\nLanguage:         ' + movie.data.Language
        φ += '\nPlot:             ' + movie.data.Plot
        φ += '\nActors:           ' + movie.data.Actors + '\n'
        φ += '\n---------------------------------------\n'
        log(φ)
    })
}
const callBands = (str)=>{
    let φ = ''
    φ += '\n-------------------------------------------------------'
    φ += '\nSearching BandsinTown for ' + str
    φ += '\n-------------------------------------------------------\n'
    let url = "https://rest.bandsintown.com/artists/" + str + "/events?app_id=codingbootcamp"
    axios.get(url).then((band)=>{
        let  d = band.data
        for (let i in d) {
            φ += '\n---------------------------------------\n'
            φ += '\nVenue:      ' + d[i].venue.name
            φ += '\nLocation:   ' + d[i].venue.city + ', ' + d[i].venue.region + ' ' + d[i].venue.country
            φ += '\nEvent Date: ' + moment(d[i].datetime).format('MM/DD/YYYY') + '\n'
        }
        φ += '\n---------------------------------------\n'
        log(φ)
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
const log = (φ) => {
    console.log(φ)
    fs.appendFile('log.txt',φ,(err)=> {
        console.log('Error: ' + err)
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
