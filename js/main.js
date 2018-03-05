// RUN JSON CALL TO GET CHARACTER INFO FOR POPULATION
function characterSearch(url) {
  var $xhr = $.getJSON(url);
  $xhr.done((input) => {
    for (var i = 0; i < input.data.results.length; i++) {
      var name = input.data.results[i].name;
      var description = input.data.results[i].description;
      if (description === ''){
        description = "I can't recall who I am. Bummer";
      }
      var image = `${input.data.results[i].thumbnail.path}.${input.data.results[i].thumbnail.extension}`;
      var comicCount = input.data.results[i].comics.available;
      var detail = input.data.results[i].urls[0].url;
      var urls = input.data.results[i].urls;
      var comics = input.data.results[i].urls[urls.length-1].url;
      console.log('Image', image)
      $('#character-append').append(`<div class="col s12 m4">
      <div class="image-block border">
      <img class="box-image" src="${image}">
      </div>
      </div>`)
    }
  })
}

// ON LOAD FUNCTIONS

$(document).ready(() => {
  // MATERIALIZE JQUERY
  $('.button-collapse').sideNav();
  $('.parallax').parallax();

  // GENERATE HASH
  const ts = new Date().getTime();
  const hash = MD5(`${ts}84bcf66c5bf0fd312d7990752d5e7dfb89e72cc129892350621d77e7a6fc6d59409bf98b`).toString();

  // GENERATE CHARACTERS ON CLICK
  $('#character-submit').on('click', () => {
    const query = $('#character-input').val();
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&nameStartsWith=${query}&orderBy=name&limit=50&apikey=29892350621d77e7a6fc6d59409bf98b&hash=${hash}`;

    characterSearch(url);
  })

})
