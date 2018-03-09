var favoriteChar;
// CHECK LOCAL STORAGE TO SET FAVORITECHAR VARIABLE IMMEDIATELY
function setCharLocalStorage() {
  if (localStorage.getItem('favoriteCharacters') === null) {
    favoriteChar = {};
    localStorage.setItem('favoriteCharacters', JSON.stringify(favoriteChar))
  } else {
    favoriteChar = JSON.parse(localStorage.getItem('favoriteCharacters'))
  }
}
setCharLocalStorage()

// APPEND DATA TO CHARACTER PAGE
function characterAppend(i, image, detail, description, urls, comics, comicCount, name) {
  $('#character-append').append(`
    <a href="#modal${i}" class="modal-trigger black-text">
      <div class="col s12 m6 l6">
        <div class="image-block border">
          <img class="box-image image-wrap" src="${image}">
          <div class="middle hide-on-med-and-down">
            <h3 class="box-title">${name}</h3>
            <button class="btn-large black box-button">INFO</button>
          </div>
          <div class="character-name-box hide-on-large-only">
            <p class="character-name">${name}</p>
          </div>
        </div>
      </div>
    </a>`);
}

// APPEND DATA TO CHARACTER PAGE MODALS
function characterModalAppend(i, image, detail, description, urls, comics, comicCount, name) {
  $('#modal-append').append(`
    <div id="modal${i}" class="modal modal-fixed-footer valign-wrapper">
      <div class="modal-content row">
        <div class="col m4 hide-on-small-only">
          <img class="tall-image" src="${image}">
        </div>
        <div class="col m8 s12">
          <h4 class="modal-title">${name}</h4>
          <p class="modal-description">${description}</p>
        </div>
        <div class="col s12">
        <br>
          <h4 class="modal-subtitle">Number of comics I've appeared in: <span class="comic-count">${comicCount}</span></h4>
        </div>
      </div>
      <div class="modal-footer">
        <a id="favorite${i}" class="modal-action waves-effect waves-green btn-flat favorite" data-name="${name}"></a>
        <a href="${comics}" class="modal-action waves-effect waves-green btn-flat" target="_blank">View Comics</a>
        <a href="${urls[0].url}" class="modal-action waves-effect waves-green btn-flat" target="_blank">More Info</a>
        <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Close</a>
      </div>
    </div>`)
}

// SET FAVORITE OR UNFAVORITE CHARACTER BUTTON
function setCharFavoriteButton(i, name) {
  if (JSON.parse(localStorage.getItem('favoriteCharacters'))[name]){
    $(`#favorite${i}`).text('Unfavorite');
  } else {
    $(`#favorite${i}`).text('Favorite');
  }
}

// APPEND FAVORITES TO FAVE-APPEND SECTION
function faveAppend() {
  const favCharObj = JSON.parse(localStorage.getItem('favoriteCharacters'));
  for (var name in favCharObj){
    if (favCharObj[name] === true){
      $('#fav-char-append').append(`<a class="favorite-link" data-name="${name}">${name}</a><hr>`)
    }
  }
}

// RUN JSON CALL TO GET CHARACTER INFO FOR POPULATION
function characterSearch(url) {
  var $xhr = $.getJSON(url);
  $xhr.done((input) => {
    $('#spinner').attr('class', 'hidden center');
    for (var i = 0; i < input.data.results.length; i++) {
      const name = input.data.results[i].name;
      const image = `${input.data.results[i].thumbnail.path}.${input.data.results[i].thumbnail.extension}`;
      const comicCount = input.data.results[i].comics.available;
      const detail = input.data.results[i].urls[0].url;
      const urls = input.data.results[i].urls;
      const comics = input.data.results[i].urls[urls.length - 1].url;
      let description = input.data.results[i].description;
      if (description === ''){
        description = "It appears I don't have a description. Guess I'm not important enough for the big Marvel guys to care about.";
      }

      // CALL ABOVE DATA IN INVOKED FUNCTIONS TO APPEND DOM
      characterAppend(i, image, detail, description, urls, comics, comicCount, name);
      characterModalAppend(i, image, detail, description, urls, comics, comicCount, name);
      setCharFavoriteButton(i, name)
    }
    $('.modal').modal();

    // EVENT LISTENER FOR MODAL FAVORITE BUTTONS
    $('.favorite').click((event) => {
      const dataName = $(event.target).data('name');
      if (favoriteChar[dataName] === true){ // IF NAME IS ALREADY TRUE IN LOCAL STORAGE, SET TO FALSE
        favoriteChar[dataName] = false;
        $(event.target).text('Favorite');
      } else { // IF NAME IS ALREADY FALSE OR NON-EXISTANT IN LOCAL STORAGE, SET TO TRUE
        favoriteChar[dataName] = true;
        $(event.target).text('Unfavorite');
      }
      localStorage.setItem('favoriteCharacters', JSON.stringify(favoriteChar))
      $('#fav-char-append').empty();
      faveAppend();
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

  // ADD FAVORITED CHARACTER TO FAVORITES SECTION
  faveAppend();

  // GENERATE CHARACTERS ON CLICK
  $('#character-submit').on('click', () => {
    $('#spinner').removeClass('hidden');
    const query = $('#character-input').val();
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&nameStartsWith=${query}&orderBy=name&limit=50&apikey=29892350621d77e7a6fc6d59409bf98b&hash=${hash}`;
    $('#character-append').empty();
    $('#modal-append').empty();
    characterSearch(url);
  })

  // EMPTY THE APPENDED DOM AND INPUT VALUE ON CLICK
  $('#character-clear').on('click', () => {
    $('#modal-append').empty();
    $('#character-append').empty();
    $('#spinner').empty();
    $('#character-input').val(null);
  })

})
