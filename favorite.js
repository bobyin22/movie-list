const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
const dataPanel = document.querySelector('#data-panel')


//data是吃傳進來的值，item是data值一個一個拿出來 (這裡是要用API得出來的電影資料)
//src="https://raw.githubusercontent.com/ALPHACamp/movie-list-api/master/public/posters/80PWnSTkygi3QWWmJ3hrAwqvLnO.jpg"
//<h5 class="card-title">Movie title</h5>
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    // title, image, id
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card" style="width: 18rem;">
            <img src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster"/>
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer text-muted">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button> 
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
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
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalDescription.innerText = data.description
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image}"
              alt="movie-poster" class="img-fluid" >`
  })
}

function removeFromFavorite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}


//監聽 data panel 點擊more的話..會發生
dataPanel.addEventListener('click', onPanelClicked)

function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(Number(event.target.dataset.id)) //但是dataset id值都是字串 改數字
  }
  //多綁一個東西
  else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
}

renderMovieList(movies)



