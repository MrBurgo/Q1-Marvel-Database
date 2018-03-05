function characterSearch() {

}

$(document).ready(() => {
  // MATERIALIZE JQUERY
  $('.button-collapse').sideNav();
  $('.parallax').parallax();

  // GENERATE HASH
  const ts = new Date().getTime();
  const hash = MD5(`${ts}84bcf66c5bf0fd312d7990752d5e7dfb89e72cc129892350621d77e7a6fc6d59409bf98b`).toString()

  $('#character-submit').on('click', () => {
    const query = $('#character-input').val();
    const url = `https://gateway.marvel.com:443/v1/public/characters?ts=${ts}&nameStartsWith=${query}&orderBy=name&limit=50&apikey=29892350621d77e7a6fc6d59409bf98b&hash=${hash}`;

    var $xhr = $.getJSON(url);
    $xhr.done((input) => {
      // TODO: Display information to user
      for (var i = 0; i < input.data.results.length; i++) {
        var name = input.data.results[i].name;
        var description = input.data.results[i].description;
        if (description === ''){
          description = "I can't recall who I am. Bummer";
        }
        var image = input.data.results[i].thumbnail.path + '.' + input.data.results[i].thumbnail.extension;
        var comicCount = input.data.results[i].comics.available;
        var detail = input.data.results[i].urls[0].url;
        var urls = input.data.results[i].urls;
        var comics = input.data.results[i].urls[urls.length-1].url;
        var box = '<div class="col s12 m4"><a class="link" target="_blank" href="' + detail + '">' + '<h1 id="results" class="results">' + name + '</h1>' + '<div id="image"><a target="_blank" href="' + detail + '">' + '<img id="image-small" src="' + image + '"></a></div>' + '<p id="description" class="body">' + description + '</p><br>' + '<a target="_blank" href="' + comics + '>' + '</a><p id="comics" class="body"> Number of comic book appearances: ' + comicCount + '</p>' + '</div>';
        console.log('Box', box)
        $('#index-append').append(`<div class="col s12"><p>${name}</p></div>`);
      }
    })
  })

})
