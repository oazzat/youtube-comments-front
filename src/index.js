const endPoint = "http://localhost:3000/api/v1/users"
const KEY = "AIzaSyDhOR4z5ZCpdPtCAgZy-P3_T3B6DZ_FLCc"
const youtubeApiUrl = "https://www.googleapis.com/youtube/v3/commentThreads?"
allVids = []
results = {}
  const youTubeSearchUrl = "https://www.googleapis.com/youtube/v3/search/?"

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
    readyToAnalyze()
}

function readyToAnalyze(){

    addEventListener("click", (e)=>{

    if (e.target.classList[0] === "analyze-button"){
    vidId = e.target.parentElement.id
    allVids.forEach(async (vid)=>{
      // debugger
      if (vidId === vid.id.videoId && e.target.parentElement.lastChild.id !== "analysis"){
        analysis = await youtubeComments(vid)
        // debugger
        attachAnalysis(e,analysis)
        // debugger
      }
    })
  }
  })
}

function attachAnalysis(e,analysis){
  let an = document.createElement('span')
  an.id = "analysis"
  an.innerHTML = `<h4>RATING: ${analysis.type}</h4>
                  <h4>RATING PERCENT: ${(analysis.ratio*100).toFixed(2)}%</h4>`
  e.target.parentElement.append(an)

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

      allWords = allWords.substring(0,5000)

      // allWords = allWords.split(" ")
      // let wordTotal = wordCount(allWords)
      // console.log(wordTotal)
      //           //console.log(JSON.stringify(wordsInOrder))
      //           //console.log(wordsInOrder)
      //           //console.log(wordCount)
      // allWords = allWords.join(" ")
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
