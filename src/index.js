const endPoint = "http://localhost:3000/api/v1/"
const ykey = config.YOUTUBE_KEY
const skey = config.SENTIMENT_KEY
const youtubeApiUrl = "https://www.googleapis.com/youtube/v3/commentThreads?"
allVids = []
results = {}
allApiVids = []
allApiUsers = []
currentVid = ""
currentUser = ""
currentPvs = ""
allApiPvs = ""

const youTubeSearchUrl = "https://www.googleapis.com/youtube/v3/search/?"

document.addEventListener("DOMContentLoaded",()=>{
  getUsers()
  getPvs()
  document.querySelector("#searchForm").style.display = "none"
// debugger
  validateOrCreateUser()
    // document.querySelector("#submit-but").lastElementChild.value = "Log In"
    // document.querySelector(//get form)

  getVidsfromDatabase()
  searchEventListener()
  readyToAnalyze()
  addToPlaylist()
  removeFromPlaylist()
  removePlaylistVidFromDom()
})

function validateOrCreateUser(){
  document.querySelector("#userForm").addEventListener("submit",async (e)=>{
    e.preventDefault()

    let username = document.querySelector("#userIn").value

    allApiUsers.forEach((user)=>{
      if (user.name === username){
        // debugger
        currentUser = user
        // debugger
      }

    })

    if (currentUser.name !== username){await postUser({name: username}); currentUser = allApiUsers.slice(-1)[0]}

    document.querySelector("#userForm").reset()
    document.querySelector("#userForm").style.display = "none"
    document.querySelector("#searchForm").style.display = "block"
    document.querySelector("#playlist").style.display = "block"
    displayPlaylist()

  })

}

function displayPlaylist(){
  let playlist = currentUser.playlist_id
  let vidsInPlaylist = []
  let youId = []
  let youTitle = []
  let stuffToDisplay = []

  allApiPvs.forEach(pv=>{
    if (pv.playlist_id === playlist){
      vidsInPlaylist.push(pv.video_id)
      allApiVids.find((elem)=>{
        if (elem.id === pv.video_id){
        youId.push(elem.youtubeId)
        youTitle.push(elem.title)
        return elem.id === pv.video_id
      }
      })
    }
  })


  youId.forEach((elem,ind)=>{
    let link = `https://www.youtube.com/watch?v=${elem}`
     //stuffToDisplay[link] = youTitle[ind]
     newListItem(link,youTitle[ind])


  })



}

function newListItem(link,title){
  let newLi = document.createElement("li")
  let removeToPlaylistButton = document.createElement("button")
  removeToPlaylistButton.innerText = "Remove"
  removeToPlaylistButton.className = "Remove-item"
  newLi.innerHTML = `
  <h5><a href="${link}">${title}</a></h5>
  `
  newLi.append(removeToPlaylistButton)
  document.querySelector("#playlist-list").append(newLi)
}

function removePlaylistVidFromDom(){
  document.addEventListener("click",(e)=>{
    if (e.target.classList[0] === "Remove-item"){

      if(Array.from(document.getElementsByTagName("iframe")) != []){
        debugger
      Array.from(document.getElementsByTagName("h2")).forEach((item)=>{

        if (item.innerText === e.target.parentElement.firstElementChild.innerText){
          item.parentElement.lastElementChild.click()
        }
      })
    }
    else{
      allVids.forEach((vid)=>{
        debugger
        if(e.target.parentElement.firstElementChild.innerText === vid.snippet.title){
          debugger
        }
      })
    }

      e.target.parentElement.remove()
    }
  })
}

function removeFromPlaylist(){
  document.addEventListener("click",(e)=>{

    if (e.target.classList[0] === "Remove-from-playlist"){
    videoId = e.target.parentElement.id

    // let check = true
    // allApiPvs.forEach((pv)=>{
    //   if pv.video_id === videoId
    // })
    // debugger
    allApiVids.forEach(async (vid)=>{
// debugger
      if(videoId === vid.youtubeId){
        // debugger
        if (vidAlreadyInPlaylist(vid)){
          // debugger
        await fetch(endPoint+`playlistvideos/${currentPvs.id}`,{
          method: "DELETE",
          //headers:{"Content-Type": "application/json"},
          //body: JSON.stringify({playlist_id: currentUser.playlist_id, video_id: vid.id})
        })
          .then(rem => {
            allApiPvs.forEach((pv) =>{
              if (pv.id === currentPvs.id){
                let ind = allApiPvs.indexOf(pv)
                allApiPvs.splice(ind,1)
              }
            })
          })
        // .then(res => res.json())
        // .then(newPv => {allApiPvs.push(newPv); getPvs()})
        // .then(async (ap) => {return await getPvs()})
      }
        //post playlist
      }
    })
  }
  })
  }

function addToPlaylist(){
  document.addEventListener("click",(e)=>{

    if (e.target.classList[0] === "Add-to-playlist"){
    videoId = e.target.parentElement.id

    // let check = true
    // allApiPvs.forEach((pv)=>{
    //   if pv.video_id === videoId
    // })

    allApiVids.forEach(async (vid)=>{

      if(videoId === vid.youtubeId){
        // debugger
        if (!vidAlreadyInPlaylist(vid)){
          // debugger
        await fetch(endPoint+"playlistvideos",{
          method: "POST",
          headers:{"Content-Type": "application/json"},
          body: JSON.stringify({playlist_id: currentUser.playlist_id, video_id: vid.id})
        })
        .then(res => res.json())
        .then(newPv => {
          allApiPvs.push(newPv); getPvs()
          let link = `https://www.youtube.com/watch?v=${vid.youtubeId}`
          newListItem(link,vid.title)
        })
        // .then(async (ap) => {return await getPvs()})
      }
        //post playlist
      }
    })
  }
  })
}

function getVidsfromDatabase(){
  fetch(endPoint+"videos")
    .then(res => res.json())
    .then(vids => {
        allApiVids = vids
    })

}

function getPvs(){
  fetch(endPoint+"playlistvideos")
    .then(res => res.json())
    .then(pvs => {
        allApiPvs = pvs
    })

}


  function searchVids(searchParams){
    fetch(`${youTubeSearchUrl}${searchParams}`)
      .then(res => res.json())
      .then(data => {
        displayVids(data.items)
        addVids(data.items)
      })
      .then(asdf => {

        //youtubeComments(allVids[3])
      })

  }

  function addVids(vids){
    allVids = vids
  }


function displayVids(data){
    data.forEach((vid)=>{
      let newVid = document.createElement('div')
      let anButton = document.createElement('button')
      anButton.innerText = `analyze`
      anButton.className = "analyze-button"
      newVid.id = vid.id.videoId
      newVid.innerHTML = `<h2>${vid.snippet.title}</h2>
    <iframe class="video w100" width="640" height="360" src="https://www.youtube.com/embed/${vid.id.videoId}" frameborder="0" allowfullscreen></iframe>`
      newVid.append(anButton)
      document.querySelector("#results").append(newVid)
    })
    // readyToAnalyze()
}

function vidAlreadyAnalyzed(vid){
  let check = false
  allApiVids.forEach((apiVid) => {
    if (vid.id.videoId === apiVid["youtubeId"]){ check = true; currentVid = apiVid}
  })
  return check
}

function vidAlreadyInPlaylist(vid){
  let check = false
  allApiPvs.forEach((apiPv) => {
    if (vid.id === apiPv.video_id && apiPv.playlist_id === currentUser.playlist_id){currentPvs = apiPv; check = true}
  })
  return check
}

async function readyToAnalyze(){

    document.addEventListener("click", (e)=>{

    if (e.target.classList[0] === "analyze-button"){
    vidId = e.target.parentElement.id
    allVids.forEach(async (vid)=>{
      // debugger
      let analysis = ""

      if (vidId === vid.id.videoId && e.target.parentElement.lastChild.id !== "analysis"){

        if (!vidAlreadyAnalyzed(vid)){

        analysis = await youtubeComments(vid)
        // debugger
        // attachAnalysis(e,analysis)
        let vidToPost = {}
        vidToPost.typee = analysis.type
        // debugger
        vidToPost.ratio = analysis.ratio
        vidToPost.score = analysis.score
        vidToPost.keywords = analysis.keywords.map((obj)=>{return obj["word"]}).join(",")
        vidToPost.youtubeId = vid.id.videoId
        vidToPost.title = vid.snippet.title
        console.log(vidToPost)
        await postVideo(vidToPost)
        getVidsfromDatabase()
        // attachAnalysis(e,analysis)
      }
      else{
        analysis = {type: currentVid.typee,ratio: currentVid.ratio }
        // debugger

      }
      // attachAnalysis(e,analysis)
        // debugger
        if(!e.target.parentElement.querySelector(".analysis")){
          // debugger
        attachAnalysis(e,analysis)
      }

      }
    })
  }
  })
}

function attachAnalysis(e,analysis){
  let an = document.createElement('span')
  an.className = "analysis"
  an.innerHTML = `<h4>Comments Analysis: ${analysis.type }</h4>
                  <h4>Comments Rating: ${(analysis.ratio*100).toFixed(2)}%</h4>`
  e.target.parentElement.append(an)
  let addToPlaylistButton = document.createElement("button")
  addToPlaylistButton.innerText = "Add to My Playlist"
  addToPlaylistButton.className = "Add-to-playlist"
  e.target.parentElement.append(addToPlaylistButton)

  let removeToPlaylistButton = document.createElement("button")
  removeToPlaylistButton.innerText = "Remove from My Playlist"
  removeToPlaylistButton.className = "Remove-from-playlist"
  e.target.parentElement.append(removeToPlaylistButton)
}


function youtubeComments(vidToAnalyze){
  const params = new URLSearchParams({
      part: "snippet,replies",
      maxResults: "100",
      order: "relevance",
      videoId: vidToAnalyze.id.videoId,
      key: ykey,
      pageToken: ""
    })

  let allComments = []
  return fetch(`${youtubeApiUrl}${params}`)
    .then(res => res.json())
    .then(data => {
        allComments = [...Array.from(data.items)]
        return allComments
      })
    .then(async all => {
      let allWords = ''
      allWords = getCommentText(all).join(" ")
      allWords = allWords.replace("<","")
      allWords = allWords.replace("\n","")
      allWords = allWords.replace("\r","")
      allWords = allWords.replace("\t","")
      allWords = allWords.replace("+","")
      allWords = allWords.replace(/s/g,"")
      allWords = allWords.replace("?","")
      allWords = allWords.substring(0,5000)

      allWords = allWords.split(" ")
      let wordTotal = wordCount(allWords)
      console.log(wordTotal)
                //console.log(JSON.stringify(wordsInOrder))
                //console.log(wordsInOrder)
                //console.log(wordCount)
      allWords = allWords.join(" ")
      // debugger

      return await analyze(allWords)

      // console.log(analysis)
      //fix the scope for allWords and analysis (which contains the analysis of vid analyzed)
    })
    // .then(analysis => {
    //   // console.log(analysis)
    // })

}


function wordCount(allWords){
  let words = {}
  // let wordCount = []
  let prev = ''
  // debugger
  allWords.sort()
  allWords.forEach((word,i)=>{
    // debugger
    if (allWords[i] !== prev){
      words[allWords[i]] = 1
      //wordCount.push(1)
    }
    else{
      words[allWords[i]] = words[allWords[i]]+1
      //wordCount[wordCount.length-1]++
    }
    prev = allWords[i]
  })
  let wordsInOrder = []
  for (var key in words) {
    wordsInOrder.push([key, words[key]]);
  }
  wordsInOrder.sort(function(a, b) {
    return a[1] - b[1];
    });

  return wordsInOrder.reverse().slice(0,100)
}

function getCommentText(allComments){
  let commentsTextArray = []
  allComments.forEach((comment) => {
    commentsTextArray.push(comment.snippet.topLevelComment.snippet.textOriginal)
  })
  // console.log(commentsTextArray)
  return commentsTextArray
}


function analyze(words){
  return fetch(`https://twinword-sentiment-analysis.p.mashape.com/analyze/?text=${words}`,{
    headers:{
    "X-Mashape-Key": skey,
    "Accept": "application/json"
  }
  })
    .then(res => res.json())
    .then(result => {
      console.log(result)

      return result
    })
}

function searchEventListener(){
document.querySelector("#searchForm").addEventListener("submit",(e)=>{

  e.preventDefault()
  document.querySelector("#results").innerHTML= ""
  const searchParams = new URLSearchParams({
      part: "snippet",
      maxResults: "5",
      type: "video",
      q: document.querySelector("#search").value,
      key: ykey
    })
  // searchParams["q"] = document.querySelector("#search").value

  searchVids(searchParams)
})
}
//--------------------------------------------------


function getUsers(){
  fetch(endPoint+"users")
    .then(res => res.json())
    .then(data => {allApiUsers = data})
}

function postUser(user){
  return fetch(endPoint+"users",{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(user)
  })
    .then(res => res.json())
    .then(userr => allApiUsers.push(userr))
    .then(curUser => {currentUser = allApiUsers.slice(-1)[0]})
}

//pass in object with params that api will accept
function postVideo(video){
  // debugger
  fetch(endPoint+"videos",{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(video)
  })
    .then(res => res.json())
    .then(newVid => {allApiVids.push(newVid)})
    // .then(res => res.json())
    // .then(data => console.log(data))

}
