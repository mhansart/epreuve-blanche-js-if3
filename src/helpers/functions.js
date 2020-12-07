// Fonction pour supprimer les doublons dans un array
export const uniqueArray = (arr) => arr.filter((item, pos) => arr.indexOf(item) === pos);

// fonction rendering
export const render = (arr1, arr2, div) => {
  div.innerHTML = '';
  arr1.forEach((elt, i) => {
    if (elt !== null) {
      let eltId;
      if (elt.img) {
        eltId = arr2.indexOf(
          arr2.find((movie) => movie.marqueur === elt.imdb),
        );
      } else {
        eltId = arr2.indexOf(
          arr2.find((movie) => movie.marqueur === elt.title),
        );
      }

      const heart = `<i class="${(arr2[eltId].like === false) ? 'far' : 'fas'} fa-heart"></i>`;
      const imgCard = elt.img ? `<img class="card-img-top" src="${elt.imdb}.jpg" alt="${elt.title}">` : `<div class="card-img-top img-default">${elt.title}</div>`;
      div.innerHTML += `<div class="card col-12 col-sm-6 col-md-3" id="movie-${i}">
                                  <div class="card-container ">
                                  <div class="heart">${heart}</div>
                                      ${imgCard}
                                  </div>
                                </div>`;
    }
  });
};
