__path = process.cwd()

var express = require('express')
var db = require(__path + '/database/db'),
    rapi = db.get("rapi")

var creatorList = ['@irwan_x_yans','@reihwangs','@irwan_x_yans', '@f.n.y.a.l.e.x','@reihwangs','@irwan_x_yans', '@f.n.y.a.l.e.x','@reihwangs']
var creator = creatorList[Math.floor(Math.random() * creatorList.length)]

var fetch = require('node-fetch')
var TikTokScraper = require('tiktok-scraper')
var router  = express.Router()

var { color, bgcolor } = require(__path + '/lib/color.js')
var options = require(__path + '/lib/options.js')
var cheerio = require('cheerio')
var request = require('request')
var imgbbUploader = require("imgbb-uploader")

loghandler = {
    notparam: {
        status: false,
        creator: `${creator}`,
        code: 406,
        message: 'masukan parameter apikey',
        getApikey: 'gapunya apikey? chat saya wa.me/62882611841 , apikey nya free kok, saya buat rest api ini menggunakan apikey agar saya tau siapa saja yang menggunakan'
    },
    notkey: {
        status: false,
        creator: `${creator}`,
        code: 406,
        message: 'masukan parameter key'
    },
    noturl: {
        status: false,
        creator: `${creator}`,
        code: 406,
        message: 'masukan parameter url'
    },
    nottext: {
        status: false,
        creator: `${creator}`,
        code: 406,
        message: 'masukan parameter text'
    },
    nottext2: {
        status: false,
        creator: `${creator}`,
        code: 406,
        message: 'masukan parameter text2'
    },
    nottext3: {
        status: false,
        creator: `${creator}`,
        code: 406,
        message: 'masukan parameter text3'
    },
    nottheme: {
        status: false,
        creator: `${creator}`,
        code: 406,
        message: 'masukan parameter theme'
    },
    notusername: {
        status: false,
        creator: `${creator}`,
        code: 406,
        message: 'masukan parameter username'
    },
    notvalue: {
        status: false,
        creator: `${creator}`,
        code: 406,
        message: 'masukan parameter value'
    },
    notheme: {
    	status: false,
        creator: `${creator}`,
        code: 406,
        message: 'theme tidak tersedia silahkan masukkan texmaker/list atau baca documentasi'
     },
    invalidKey: {
        status: false,
        creator: `${creator}`,
        code: 406,
        message: 'apikey invalid.'
    },
    invalidlink: {
        status: false,
        creator: `${creator}`,
        message: 'error, mungkin link anda tidak valid.'
    },
    notAddApiKey: {
        status: false,
        creator: `${creator}`,
        code: 406,
        message: 'masukan parameter status, apikeyInput, email, nomorhp, name, age, country, exp'
    },
    error: {
        status: false,
        creator: `${creator}`,
        message: 'mungkin sedang dilakukan perbaikan'
    }
}

//START RANDOM
var len = 15
        var arr = '123456789abcdefghijklmnopqrstuvwxyz'
        var random = '';

        for (var i = len; i > 0; i--) {
            random += arr[Math.floor(Math.random() * arr.length)];
        }

        var lenn = 5
        var randomlagi = '';

        for (var i = lenn; i > 0; i--) {
            randomlagi += arr[Math.floor(Math.random() * arr.length)];
        }

        var randomTextNumber = random+randomlagi+'---------IrwanGanteng'+'RIZQI--GANTENG';
        
 //END RANDOM 
router.get('/find', async (req, res, next) => {
    var apikey = req.query.apikey
    if (!apikey) return res.json(loghandler.notparam)
    if (apikey != 'irwangans') return res.json(loghandler.invalidKey)

    try {
        rapi.find()
            .then(result => {
                res.json({
                    status: true,
                    creator: `${creator}`,
                    result
                })
        })
    } catch (e) {
        console.log(e)
        res.json(loghandler.error)
    }
})

router.get('/cekapikey', async (req, res, next) => {
	var apikeyInput = req.query.apikey
	if(!apikeyInput) return res.json(loghandler.notparam)
	a = await rapi.findOne({apikey:apikeyInput})
	if (a) {
	json = JSON.stringify({
		status: true,
		creator: creator,
		result: {
            status:a.status,
			id: a._id,
			apikey: a.apikey,
			more_info: {
				email: a.email,
				nomor_hp: a.nomor_hp,
				name: a.name,
				age: a.age,
				country: a.country,
				exp:a.exp,
			},
		},
		message: `jangan lupa follow ${creator}`
	})
} else {
	json = JSON.stringify({
		status: false
	})
}
res.send(JSON.parse(json))
})

router.get('/addapikey', (req, res, next) => {
    var apikey = req.query.apikey,
        status = req.query.status,
        apikeyInput  = req.query.apikeyInput,
        email = req.query.email,
        nomorhp = req.query.nomorhp
        name = req.query.name,
        age = req.query.age,
        country = req.query.country;
        exp = req.query.exp;

    if (!apikey) return res.json(loghandler.notparam)
    if (!(status && apikeyInput && email && nomorhp && name && age && country && exp)) return res.json(loghandler.notAddApiKey)
    if (apikey != 'irwangans') return res.json(loghandler.invalidKey)

    try {
        rapi.insert({
        	status: status,
            apikey: apikeyInput,
            email: email,
            nomor_hp: nomorhp,
            name: name,
            age: age,
            country: country,
            exp: exp
        })
        .then(() => {
              res.json({
                  status: true,
                  creator: `${creator}`,
                  result: 'berhasil menambah data, status : ' + status + ', apikey : ' + apikeyInput + ', email : ' + email + ', nomor_hp : ' + nomorhp + ', name :  ' + name + ', age : ' + age + ', country : ' + country + ', exp : ' + exp
              })
        })
    } catch (e) {
        console.log(e)
        res.json(loghandler.error)
    }
})

router.get('/remove', (req, res, next) => {
    var apikey = req.query.apikey,
        status = req.query.status,
        apikeyInput  = req.query.apikeyInput,
        email = req.query.email,
        nomorhp = req.query.nomorhp
        name = req.query.name,
        age = req.query.age,
        country = req.query.country;
        exp = req.query.exp;

    if (!apikey) return res.json(loghandler.notparam)
    if (!(status && apikeyInput && email && nomorhp && name && age && country && exp)) return res.json(loghandler.notAddApiKey)
    if (apikey != 'irwangans') return res.json(loghandler.invalidKey)

    try {
        rapi.remove({
            status: status,
            apikey: apikeyInput,
            email: email,
            nomor_hp: nomorhp,
            name: name,
            age: age,
            country: country,
            exp: exp
        })
        .then(() => {
             res.json({
                  status: true,
                  creator: `${creator}`,
                  result: 'berhasil menghapus data, status : ' + status + ', apikey : ' + apikeyInput + ', email : ' + email + ', nomor_hp : ' + nomorhp + ', name :  ' + name + ', age : ' + age + ', country : ' + country + ', exp : ' + exp
              })
        })
    } catch (e) {
        console.log(e)
        res.json(loghandler.error)
    }
})

router.get('/covid-indo', async (req, res, next) => {
    var apikeyInput = req.query.apikey
	if(!apikeyInput) return res.json(loghandler.notparam)
	a = await rapi.findOne({apikey:apikeyInput}) ? true : false
	if(a == false) return res.json(loghandler.invalidKey)

    fetch(encodeURI(`https://api.kawalcorona.com/indonesia`))
        .then(response => response.json())
        .then(data => {
            res.json({
                status: true,
                creator: `${creator}`,
                result: {
                    positif: `${data[0].positif}`,
                    sembuh: `${data[0].sembuh}`,
                    dirawat: `${data[0].dirawat}`,
                    meninggal: `${data[0].meninggal}`,
                },
                message: "Tetap jalani protokol kesehatan dan Semangattt"
            })
        })
})

router.get('/igdown', async (req, res, next) => {
    var apikeyInput = req.query.apikey,
        url = req.query.url

    if (!url) return res.json(loghandler.noturl)
	if(!apikeyInput) return res.json(loghandler.notparam)
	a = await rapi.findOne({apikey:apikeyInput}) ? true : false
	if(a == false) return res.json(loghandler.invalidKey)

    var str = url
    var potong = str.split('?')
    var graph = "?__a=1"
    var potong2 = potong[0] + graph

    fetch(encodeURI(potong2))
        .then(response => response.json())
        .then(data => {
            var validasi = data["graphql"]["shortcode_media"]["__typename"];
            if (validasi == "GraphVideo") {
                var link = data.graphql.shortcode_media.video_url;
                res.json({
                    status: true,
                    creator: `${creator}`,
                    result: {
                        type: "Video",
                        url: link
                    },
                    message: "jangan lupa follow" + creator
                })
            } else if (validasi == "GraphImage") {
                var link = data.graphql.shortcode_media.display_url;
                res.json({
                    status: true,
                    creator: `${creator}`,
                    result: {
                        type: "Picture",
                        url: link
                    },
                    message: "jangan lupa follow" + creator
                })
            } else {
                res.json({
                    status: false,
                    creator: `${creator}`,
                    message: "mungkin terjadi error"
                })
            }
        })
        .catch(e => {
            console.log('Error:', color(e,'red'))
            res.json({status:false,creator: `${creator}`, message: "gagal, pastikan url anda benar:)"})
       })
})

router.get('/igstalk', async (req, res, next) => {
    var apikeyInput = req.query.apikey,
        username = req.query.username

	if(!apikeyInput) return res.json(loghandler.notparam)
	a = await rapi.findOne({apikey:apikeyInput}) ? true : false
	if(a == false) return res.json(loghandler.invalidKey)
    if (!username) return res.json(loghandler.notusername)

    fetch(encodeURI(`https://www.instagram.com/${username}/?__a=1`))
        .then(response => response.json())
        .then(data => {
             var bisnis_or = data.graphql.user.is_business_account == false ? "bukan bisnis": "ini bisnis"
             var verif_or =  data.graphql.user.is_verified == false ? "belum verified / centang biru": "sudah verified / centang biru"
             var response = {
                 status: true,
                 creator: `${creator}`,
                 result: {
                      username: `${data.graphql.user.username}`,
                      name: `${data.graphql.user.full_name}`,
                      biodata: `${data.graphql.user.biography}`,
                      followers: `${data.graphql.user.edge_followed_by.count}`,
                      following:`${data.graphql.user.edge_follow.count}`,
                      verified: verif_or,
                      business_account: bisnis_or,
                      post: `${data.graphql.user.edge_owner_to_timeline_media.count}`,
                      profile_picture: `${data.graphql.user.profile_pic_url}`,
                      profile_picture_hd: `${data.graphql.user.profile_pic_url_hd}`,
                 },
                 message: `jangan lupa follow ${creator}`
             }
             res.json(response)
        })
})

router.get('/ttdown-nown', async (req, res, next) => {
    var apikeyInput = req.query.apikey,
        url = req.query.url


	if(!apikeyInput) return res.json(loghandler.notparam)
	a = await rapi.findOne({apikey:apikeyInput}) ? true : false
	if(a == false) return res.json(loghandler.invalidKey)
     if (!url) return res.json(loghandler.noturl)

     TikTokScraper.getVideoMeta(url, options)
         .then(vid => {
             console.log(vid)
             res.json({
                 status: true,
                 creator: `${creator}`,
                 videoNoWm: vid
             })
         })
         .catch(e => {
             res.json(loghandler.invalidlink)
         })
})

router.get('/ttstalk', async (req, res, next) => {
    var apikeyInput = req.query.apikey,
        username = req.query.username

	if(!apikeyInput) return res.json(loghandler.notparam)
	a = await rapi.findOne({apikey:apikeyInput}) ? true : false
	if(a == false) return res.json(loghandler.invalidKey)
    if (!username) return res.json(loghandler.notusername)


    TikTokScraper.getUserProfileInfo(username)
        .then(user => {
            res.json({
                status : true,
                creator : `${creator}`,
                result : user
            })
        })
        .catch(e => {
             res.json({
                 status : false,
                 creator : `${creator}`,
                 message : "error, mungkin username anda tidak valid"
             })
         })
})

router.get('/randomquote', (req, res, next) => {
    var apikey = req.query.apikey

    if (!apikey) return res.json(loghandler.notparam)
    if (apikey != 'irwangans') return res.json(loghandler.invalidKey)

    fetch(encodeURI(`https://mhankbarbar.tech/api/randomquotes`))
        .then(response => response.json())
        .then(data => {
             res.json({
                 status : true,
                 creator : `${creator}`,
                 result : {
                     author : `${data.author}`,
                     quotes : `${data.quotes}`,
                 },
                 message : `jangan lupa follow ${creator}`
             })
         })
         .catch(e => {})
})


router.get('/randomloli', (req, res, next) => {
    var apikey = req.query.apikey

    if (!apikey) return res.json(loghandler.notparam)
    if (apikey != 'irwangans') return res.json(loghandler.invalidKey)

    try {
        var options = {
            url: "http://results.dogpile.com/serp?qc=images&q= " + "Loli",
            method: "GET",
            headers: {
                "Accept": "text/html",
                "User-Agent": "Chrome"
            }
        }

        request(options, function(error, response, responseBody) {
            if (error) return

            $ = cheerio.load(responseBody)
            var links = $(".image a.link")
            var cari = new Array(links.length).fill(0).map((v, i) => links.eq(i).attr("href"))

            if (!cari.length) return
            var hasil = cari[Math.floor(Math.random() * cari.length)]

            res.json({
                status : true,
                creator : `${creator}`,
                result : {
                    image : 'mme',
                },
                message : `jangan lupa follow ${creator}`})
            })
    } catch (e) {}
})

router.get('/infonpm', async (req, res, next) => {
        var apikeyInput = req.query.apikey,
            query = req.query.query,
            host = req.hostname
            
	if(!apikeyInput) return res.json(loghandler.notparam)
	a = await rapi.findOne({apikey:apikeyInput}) ? true : false
	if(a == false) return res.json(loghandler.invalidKey)
    if (!query) return res.json({ status : false, creator : `${creator}`, message : "masukan parameter query"})

       fetch(encodeURI(`https://registry.npmjs.org/${query}`))
        .then(response => response.json())
        .then(data => {
        var result = data;
             res.json({
                 status : true,
                 creator : `${creator}`,
                 result,
                 message : `jangan lupa follow ${creator}`
             })
         })
         .catch(e => {
         	res.json(loghandler.error)
})
})


router.get('/shorturl/tinyurl', async (req, res, next) => {
    var apikeyInput = req.query.apikey,
        url = req.query.url

	if(!apikeyInput) return res.json(loghandler.notparam)
	a = await rapi.findOne({apikey:apikeyInput}) ? true : false
	if(a == false) return res.json(loghandler.invalidKey)
     if (!url) return res.json(loghandler.noturl)

     request(`https://tinyurl.com/api-create.php?url=${url}`, function (error, response, body) {
         try {
             res.json({
                 status : true,
                 creator : `${creator}`,
                 result : {
                     link : `${body}`,
                 },
                 message : `jangan lupa follow ${creator}`
             })
         } catch (e) {
             console.log('Error :', color(e,'red'))
             res.json(loghandler.invalidlink)
         }
     })
})

router.get('/text2img', async (req, res, next) => {
	var apikeyInput = req.query.apikey,
	text = req.query.text;
	if(!apikeyInput) return res.json(loghandler.notparam)
	a = await rapi.findOne({apikey:apikeyInput}) ? true : false
	if(a == false) return res.json(loghandler.invalidKey)
     if (!text) return res.json(loghandler.nottext)
	request(`http://api.img4me.com/?text=${text}&font=arial&fcolor=000000&size=35&type=png`, function (error, response, body) {
         try {
         	fetch(encodeURI(`https://api.imgbb.com/1/upload?expiration=120&key=28dd175b555860ab2b5cdfedf125fe38&image=${body}&name=${randomTextNumber}`))
                                .then(response => response.json())
                                .then(data => {
                 var urlnya = data.data.url,
                                     delete_url = data.data.delete_url;
             res.json({
                 status : true,
                 creator : `${creator}`,
                 result : {
                 	text : text,
                     url : urlnya,
                     delete_url : delete_url,
                 },
                 message : `jangan lupa follow ${creator}`
             })
             })
         } catch (e) {
             console.log('Error :', color(e,'red'))
             res.json(loghandler.error)
         }
     })
 })
router.get('/texttoimg2', (req, res, next) => {
     var apikey = req.query.apikey,
         text = req.query.text

     if (!apikey) return res.json(loghandler.notparam)
     if (!text) return res.json(loghandler.nottext)
     if (apikey != 'irwangans') return res.json(loghandler.invalidKey)

     fetch(encodeURI(`https://mhankbarbar.tech/api/text2image?text=${text}&apiKey=${apiBar}`))
         .then(response => response.json())
         .then(data => {
             res.json({
                 status : true,
                 creator : `${creator}`,
                 result : {
                     image : `${data.result}`,
                     text : `${text}`
                 },
                 message : `jangan lupa follow ${creator}`
             })
         })
})

router.get('/textmaker', async (req, res, next) => {
        var theme = req.query.theme,
             text = req.query.text,
             text2 = req.query.text2,
             text3 = req.query.text3,
             apikeyInput = req.query.apikey;
        
	if(!apikeyInput) return res.json(loghandler.notparam)
	a = await rapi.findOne({apikey:apikeyInput}) ? true : false
	if(a == false) return res.json(loghandler.invalidKey)
        if (!theme) return res.json(loghandler.nottheme)
        if (theme != 'glitch' && theme != 'google-suggestion') return res.json(loghandler.notheme)
        if (!text) return res.json(loghandler.nottext)

        if (theme == 'glitch') {
        	if (!text2) return res.json(loghandler.nottext2)
            request.post({
                url: "https://photooxy.com/logo-and-text-effects/make-tik-tok-text-effect-375.html",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `text_1=${text}&text_2=${text2}&login=OK`,
                }, (e,r,b) => {
                    if (!e) {
                        $ = cheerio.load(b)
                        $(".thumbnail").find("img").each(function() {
                            h = $(this).attr("src")
                            var result = "https://photooxy.com/"+h
                            fetch(encodeURI(`https://api.imgbb.com/1/upload?expiration=120&key=28dd175b555860ab2b5cdfedf125fe38&image=${result}&name=${randomTextNumber}`))
                                .then(response => response.json())
                                .then(data => {
                                    var urlnya = data.data.url,
                                        delete_url = data.data.delete_url;
                                        res.json({
                                            status : true,
                                            creator : `${creator}`,
                                            message : `jangan lupa follow ${creator}`,
                                            result:{
                                                url:urlnya,
                                                delete_url: delete_url,
                                                info: 'url akan hilang setelah 2 menit'
                                            }
                                        })
                                })
                        })
                    }
                }) 
        } else if (theme == 'google-suggestion') {
        	if (!text2) return res.json(loghandler.nottext2)
        if (!text3) return res.json(loghandler.nottext3)
            request.post({
                url: "https://photooxy.com/other-design/make-google-suggestion-photos-238.html",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `text_1=${text}&text_2=${text2}&text_3=${text3}&login=OK`,
                }, (e,r,b) => {
                    if (!e) {
                        $ = cheerio.load(b)
                        $(".thumbnail").find("img").each(function() {
                            h = $(this).attr("src")
                            var result = "https://photooxy.com/"+h
                            fetch(encodeURI(`https://api.imgbb.com/1/upload?expiration=120&key=28dd175b555860ab2b5cdfedf125fe38&image=${result}&name=${randomTextNumber}`))
                                .then(response => response.json())
                                .then(data => {
                                    var urlnya = data.data.url,
                                        delete_url = data.data.delete_url;
                                        res.json({
                                            status : true,
                                            creator : `${creator}`,
                                            message : `jangan lupa follow ${creator}`,
                                            result:{
                                                url:urlnya,
                                                delete_url: delete_url,
                                                info: 'url akan hilang setelah 2 menit'
                                            }
                                        })
                                })
                        })
                    }
                }) 
        } else {
            res.json(loghandler.error)
        }
})

module.exports = router
