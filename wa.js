const fetch = require('fetch-base64')
const rp = require('request-promise')
const anilist = require('anilist-node');

const wa_url = 'https://trace.moe/api/search'

const Anilist = new anilist();

const Anime = (title_romaji, title_english, title_japanese, episode, at, link) => {
    return { title_romaji, title_english, title_japanese, episode, at, link }
}

exports.imgtob64 = async function(image_url) {
    const res = await fetch.remote(image_url)
    return res[0]
}

exports.callapi = async function(b64) {
    var options = {
        method: 'POST',
        uri: wa_url,
        form: { image: b64 },
    };
    return await rp(options)
}

getLink = async function(title) {
    searchResults = await Anilist.search("anime", title, 1, 1)
    id = searchResults['media'][0]['id']
    return `https://anilist.co/anime/${id}`
}

function fmtTime(s) { return(s-(s%=60))/60+(9<s?':':':0')+Math.round(s)} 

exports.parsejson = async function(json) {
    data = await JSON.parse(json)["docs"][0]
    at = await fmtTime(data["at"])
    link = await getLink(data["title_english"])
    return Anime(data["title_romaji"], data["title_english"], data["title"], data["episode"], at, link)
}