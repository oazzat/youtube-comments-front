const endPoint = "http://localhost:3000/api/v1/users"
const KEY = "AIzaSyDhOR4z5ZCpdPtCAgZy-P3_T3B6DZ_FLCc"
const youtubeApiUrl = "https://www.googleapis.com/youtube/v3/commentThreads?"
allVids = []
results = {}
  const youTubeSearchUrl = "https://www.googleapis.com/youtube/v3/search/?"

  function searchVids(searchParams){
    vidId = ""
    title = ""
    fetch(`${youTubeSearchUrl}${searchParams}`)
      .then(res => res.json())
      .then(data => {
        displayVids(data.items)
        addVids(data.items)
      })
      .then(asdf => {
        console.log(allVids)
        youtubeComments(allVids[3])
      })

  }

  function addVids(vids){
    allVids = vids
  }


function displayVids(data){
    data.forEach((vid)=>{
      let newVid = document.createElement('div')
      newVid.innerHTML = `<h2>${vid.snippet.title}</h2>
    <iframe class="video w100" width="640" height="360" src="https://www.youtube.com/embed/${vid.id.videoId}" frameborder="0" allowfullscreen></iframe>`
      document.querySelector("#results").append(newVid)
    })
}


function getUsers(){
  fetch(endPoint)
    .then(res => res.json())
    .then(data => console.log(data))
}

function postUser(){
  fetch(endPoint,{
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({name: "Second_User"})
  })
    // .then(res => res.json())
    // .then(data => console.log(data))
}


function youtubeComments(vidToAnalyze){
  const params = new URLSearchParams({
      part: "snippet,replies",
      maxResults: "100",
      order: "relevance",
      videoId: vidToAnalyze.id.videoId,
      key: KEY,
      pageToken: ""
    })

  let allComments = []
  fetch(`${youtubeApiUrl}${params}`)
    .then(res => res.json())
    .then(data => {
        allComments = [...Array.from(data.items)]
        return allComments
      })
    .then(async all => {
      allWords = getCommentText(all).join(" ")
      //console.log(allWords)
      analysis = await analyze(allWords)

      console.log(analysis)
      //fix the scope for allWords and analysis (which contains the analysis of vid analyzed)
    })
    // .then(analysis => {
    //   // console.log(analysis)
    // })

}

function getCommentText(allComments){
  let commentsTextArray = []
  allComments.forEach((comment) => {
    commentsTextArray.push(comment.snippet.topLevelComment.snippet.textDisplay)
  })
  return commentsTextArray
}

apples = {}
function analyze(words){
  return fetch(`https://twinword-sentiment-analysis.p.mashape.com/analyze/?text=${words}`,{
    headers:{
    "X-Mashape-Key": "FGuGAcw3MHmshd1CxYGiA6t3mTJCp1J2Jc6jsn36pobgltznT7",
    "Accept": "application/json"
  }
  })
    .then(res => res.json())
    .then(result => {
      console.log(result)
      return result
    })
}


//youtubeComments()
// searchVids()
document.querySelector("#searchForm").addEventListener("submit",(e)=>{
  e.preventDefault()
  document.querySelector("#results").innerHTML= ""
  const searchParams = new URLSearchParams({
      part: "snippet",
      maxResults: "5",
      type: "video",
      q: document.querySelector("#search").value,
      key: "AIzaSyCTgCQzg0tprf5v0y-AdnxtiaSUF14iY-M"
    })
  // searchParams["q"] = document.querySelector("#search").value
  searchVids(searchParams)
})
