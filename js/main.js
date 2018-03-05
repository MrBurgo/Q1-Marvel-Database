// APPEND DATA TO CHARACTER PAGE
function characterAppend(i, image, detail, description, urls, comics, comicCount, name) {
  $('#character-append').append(`
    <a href="#modal${i}" class="modal-trigger black-text">
      <div class="col s12 m4 l4">
        <div class="image-block border">
          <img class="box-image image-wrap" src="${image}">
          <div class="middle hide-on-med-and-down">
            <h3 class="box-title">${name}</h3>
            <button class="btn-large black box-button">INFO</button>
          </div>
          <div class="character-name-box hide-on-med-and-up">
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
          <img class="box-image" src="${image}">
        </div>
        <div class="col m8 s12">
          <h4 class="modal-title">${name}</h4>
          <p>${description}</p>
        </div>
      </div>
      <div class="modal-footer">
        <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Close</a>
      </div>
    </div>`)
}

// RUN JSON CALL TO GET CHARACTER INFO FOR POPULATION
function characterSearch(url) {
  var $xhr = $.getJSON(url);
  $xhr.done((input) => {
    for (var i = 0; i < input.data.results.length; i++) {
      const name = input.data.results[i].name;
      const image = `${input.data.results[i].thumbnail.path}.${input.data.results[i].thumbnail.extension}`;
      const comicCount = input.data.results[i].comics.available;
      const detail = input.data.results[i].urls[0].url;
      const urls = input.data.results[i].urls;
      const comics = input.data.results[i].urls[urls.length - 1].url;
      let description = input.data.results[i].description;
      if (description === ''){
        description = "I can't recall who I am. Bummer";
      }

      // CALL ABOVE DATA IN INVOKED FUNCTIONS TO APPEND DOM
      characterAppend(i, image, detail, description, urls, comics, comicCount, name);
      characterModalAppend(i, image, detail, description, urls, comics, comicCount, name);
    }
    $('.modal').modal();
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

  // GENERATE CHARACTERS ON CLICK
  $('#character-submit').on('click', () => {
    const query = $('#character-input').val();
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&nameStartsWith=${query}&orderBy=name&limit=50&apikey=29892350621d77e7a6fc6d59409bf98b&hash=${hash}`;
    $('#character-append').empty();
    characterSearch(url);
  })

  // EMPTY THE APPENDED DOM AND INPUT VALUE ON CLICK
  $('#character-clear').on('click', () => {
    $('#character-append').empty();
    $('#character-input').val(null);
  })

})
