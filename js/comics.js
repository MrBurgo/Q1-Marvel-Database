var favoriteComic;

// CHECK LOCAL STORAGE TO SET FAVORITECOMIC VARIABLE IMMEDIATELY
function setComicLocalStorage() {
  if (localStorage.getItem('favoriteComics') === null) {
    favoriteComic = {};
    localStorage.setItem('favoriteComics', JSON.stringify(favoriteComic))
  } else {
    favoriteComic = JSON.parse(localStorage.getItem('favoriteComics'))
  }
}
setComicLocalStorage()

// APPEND DATA TO COMIC PAGE
function comicAppend(i, title, image) {
  $('#comic-append').append(`
    <a href="#modal${i}" class="modal-trigger black-text">
      <div class="col s12 m6 l6">
        <div class="image-block border">
          <img class="box-image image-wrap" src="${image}">
          <div class="middle hide-on-med-and-down">
            <h3 class="box-title">${title}</h3>
            <button class="btn-large black box-button">INFO</button>
          </div>
          <div class="character-name-box hide-on-large-only">
            <p class="character-name">${title}</p>
          </div>
        </div>
      </div>
    </a>`);
}

// APPEND DATA TO COMIC PAGE MODALS
function comicModalAppend(i, title, image, issueNumber, detail, urls, series, description) {
  $('#modal-append').append(`
    <div id="modal${i}" class="modal modal-fixed-footer valign-wrapper">
      <div class="modal-content row">
        <div class="col m4 hide-on-small-only">
          <img class="tall-image" src="${image}">
        </div>
        <div class="col m8 s12">
          <h4 class="modal-title">${title}</h4>
          <p class="modal-description">${description}</p>
        </div>
        <div class="col s12">
        <br>
          <h4 class="modal-subtitle">Series I'm apart of: <span class="comic-count">${series}</span></h4>
        </div>
      </div>
      <div class="modal-footer">
        <a id="favorite${i}" class="modal-action waves-effect waves-green btn-flat favorite" data-name="${title}"></a>
        <a href="${detail}" class="modal-action waves-effect waves-green btn-flat" target="_blank">More Info</a>
        <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Close</a>
      </div>
    </div>`)
}

// SET FAVORITE OR UNFAVORITE COMIC BUTTON
function setComicFavoriteButton(i, title) {
  if (JSON.parse(localStorage.getItem('favoriteComics'))[title]){
    $(`#favorite${i}`).text('Unfavorite');
  } else {
    $(`#favorite${i}`).text('Favorite');
  }
}

// APPEND FAVORITES TO FAVE-APPEND SECTION
function faveAppend() {
  const favComicObj = JSON.parse(localStorage.getItem('favoriteComics'));
  for (var title in favComicObj){
    if (favComicObj[title] === true){
      $('#fav-comic-append').append(`<a class="favorite-link" data-name="${title}">${title}</a><hr>`)
    }
  }
}

// RUN JSON CALL TO GET COMIC INFO FOR POPULATION
function comicSearch(url) {
  var $xhr = $.getJSON(url);
  $xhr.done((input) => {
    $('#spinner').attr('class', 'hidden center');
    for (var i = 0; i < input.data.results.length; i++) {
      const title = input.data.results[i].title;
      const image = `${input.data.results[i].thumbnail.path}.${input.data.results[i].thumbnail.extension}`;
      const issueNumber = input.data.results[i].issueNumber;
      const detail = input.data.results[i].urls[0].url;
      const urls = input.data.results[i].urls;
      const series = input.data.results[i].series.name;
      let description = input.data.results[i].description;
      if (description === null){
        description = "It appears I don't have a description. Guess I'm not important enough for the big Marvel guys to care about.";
      }

      // CALL ABOVE DATA IN INVOKED FUNCTIONS TO APPEND DOM
      comicAppend(i, title, image);
      comicModalAppend(i, title, image, issueNumber, detail, urls, series, description);
      setComicFavoriteButton(i, title)
    }
    $('.modal').modal();

    // EVENT LISTENER FOR MODAL FAVORITE BUTTONS
    $('.favorite').click((event) => {
      const dataName = $(event.target).data('name');
      if (favoriteComic[dataName] === true){ // IF NAME IS ALREADY TRUE IN LOCAL STORAGE, SET TO FALSE
        favoriteComic[dataName] = false;
        $(event.target).text('Favorite');
      } else { // IF NAME IS ALREADY FALSE OR NON-EXISTANT IN LOCAL STORAGE, SET TO TRUE
        favoriteComic[dataName] = true;
        $(event.target).text('Unfavorite');
      }
      localStorage.setItem('favoriteComics', JSON.stringify(favoriteComic))
      $('#fav-comic-append').empty();
      faveAppend()
    })
  })
}

// ON LOAD FUNCTIONS
$(document).ready(() => {
  // MATERIALIZE JQUERY
  $('.button-collapse').sideNav();
  $('.parallax').parallax();
  // $('.modal').modal();

  // GENERATE HASH
  const ts = new Date().getTime();
  const hash = MD5(`${ts}84bcf66c5bf0fd312d7990752d5e7dfb89e72cc129892350621d77e7a6fc6d59409bf98b`).toString();

  // ADD FAVORITED COMICS TO FAVORITES SECTION
  faveAppend()

  // EMPTY THE APPENDED DOM AND INPUT VALUE ON CLICK
  $('#comic-clear').on('click', () => {
    $('#modal-append').empty();
    $('#comic-append').empty();
    $('#spinner').empty();
    $('#comic-input').val(null);
  })

  $('#comic-submit').on('click', () => {
    $('#spinner').removeClass('hidden');
    const query = $('#comic-input').val();
    const url = `https://gateway.marvel.com:443/v1/public/comics?ts=${ts}&titleStartsWith=${query}&orderBy=title&limit=50&apikey=29892350621d77e7a6fc6d59409bf98b&hash=${hash}`
    $('#comic-append').empty();
    $('#modal-append').empty();
    comicSearch(url);
  })

})
