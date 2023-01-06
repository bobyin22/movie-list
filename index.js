const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/' //https://webdev.alphacamp.io/api/movies/1
const POSTER_URL = BASE_URL + '/posters/' //https://webdev.alphacamp.io/posters/c9XxwwhPHdaImA2f1WEfEsbhaFB.jpg


const movies = []
let filteredMovies = []
const MOVIES_PER_PAGE = 12

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

//data是吃傳進來的值，item是data值一個一個拿出來 (這裡是要用API得出來的電影資料)
//src="https://raw.githubusercontent.com/ALPHACamp/movie-list-api/master/public/posters/80PWnSTkygi3QWWmJ3hrAwqvLnO.jpg"
//<h5 class="card-title">Movie title</h5>
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    // title, image
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <!-- Bootstrap Card元件 -->
          <div class="card" style="width: 18rem;">
            <!-- 卡片照片 -->
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>

            <div class="card-footer text-muted">
              <!-- 給button設定 toggle target-->
              <!-- 這個id movie-modal要讓Bootstrap Modal元件吃到才能點擊打開-->
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">
                More
              </button> <!-- 卡片More按鈕 -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button> <!-- 卡片+按鈕 -->
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function renderPaginator(amount) {
  // 80/12 = 6 ...8 = 7
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''

  for(let page=1 ; page<= numberOfPages; page++ ) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

//page -> 1
function getMoviesByPage(page) {

  //如果filterMovies是有東西的，就給我filterMovies
  //但如果filterMovies沒有東西，就給我movies
  const data = filteredMovies.length ? filteredMovies : movies

  // page 1 -> movies 0 - 11
  // page 2 -> movies 12 - 23
  // page 3 -> movies 24 - 35
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE) 
}

//發送 Request
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title') //抓HTML的電影名
  const modalImage = document.querySelector('#movie-modal-image') //抓HTML的電影照片
  const modalDate = document.querySelector('#movie-modal-date') //抓HTML的電影時間
  const modalDescription = document.querySelector('#movie-modal-description') //抓HTML的電影詳細描述

  axios.get(INDEX_URL + id).then((response) => {
    //response.data.results
    const data = response.data.results

    //console.log(response)
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}"
              alt="movie-poster" class="img-fluid">`
  })
}

//為了JSON的監聽
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id ===id) 
  
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經在收藏清單中!')
  }

  list.push(movie)
  //console.log(list)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

//監聽 data panel 點擊more的話..會發生
dataPanel.addEventListener('click', onPanelClicked)

function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    //console.log(event.target.dataset) //按了dataset 所有元素變成data 變成object給我看
    //console.log('成功')
    //console.log("變成數字",Number(event.target.dataset.id))
    showMovieModal(Number(event.target.dataset.id)) //但是dataset id值都是字串 改數字
  }
  //多綁一個東西
  else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
}
searchForm.addEventListener('submit', onSearchFormSubmitted)

function onSearchFormSubmitted(event) {
  event.preventDefault()
  //console.log(event)
  //console.log(searchInput.value)
  const keyword = searchInput.value.trim().toLowerCase()

  //console.log(keyword)

  if (keyword.length === 0) {
    return alert('輸入格式不正確')
  }
  for (const movie of movies) {
    if (movie.title.toLowerCase().includes(keyword)) {
      filteredMovies.push(movie)
    }
  }

  if (filteredMovies.length === 0) {
    return alert('找不到電影', keyword)
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMoviesByPage(1))
}

paginator.addEventListener('click', onPaginatorClicked)

function onPaginatorClicked(event) {
  if(event.target.tagName !== 'A' ) return 
  //<a></a>
  
  const page = Number(event.target.dataset.page)
  renderMovieList(getMoviesByPage(page))
}


// 查看response的值
// axios
//   .get(INDEX_URL) // 修改這裡
//   .then((response) => {
//     console.log(response)
//     console.log(response.data)
//     console.log(response.data.results)
//   })
//   .catch((err) => console.log(err))

// [{}, {}, {}, {}]  陣列長度1
// axios
//   .get(INDEX_URL)
//   .then((response) => {
//     movies.push(response.data.results)
//     console.log(movies)
//     console.log(movies.length) // 1
//   })
//   .catch((err) => console.log(err))


axios
  .get(INDEX_URL)
  .then((response) => {
    for (const movie of response.data.results) {
      movies.push(movie)
    }
    //console.log(movies)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1)) //新增這行 把API放入函式中
  })
  .catch((err) => console.log(err))
// console.log("這是movies", movies)


//寫死 要的id
// axios
//   .get(INDEX_URL + '68')
//   .then((response) => {

//     console.log(response.data.results)

//   })
//   .catch((err) => console.log(err))
// // console.log("這是movies", movies)

//setItem 傳入 key, value
//localStorage.setItem("default_language", "english")
// console.log(localStorage.getItem('default_language'))
// localStorage.removeItem('default_language')
// console.log(localStorage.getItem('default_language'))
localStorage.setItem('default_language', JSON.stringify())