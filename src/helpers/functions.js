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

export const renderInCarousel = (arr1, div) => {
  div.innerHTML = ' <div class="carousel-item active"><div class="row" id="slide-1"></div></div>';
  for (let i = 2; i < 5; i++) {
    div.innerHTML += ` <div class="carousel-item"><div class="row" id="slide-${i}"></div></div>`;
  }
  const carouselItem1 = document.getElementById('slide-1');
  const carouselItem2 = document.getElementById('slide-2');
  const carouselItem3 = document.getElementById('slide-3');
  const carouselItem4 = document.getElementById('slide-4');

  arr1.forEach((elt, i) => {
    const marqueurMovie = elt.img ? `<img class="card-img-top" src="${elt.imdb}.jpg" alt="${elt.title}">` : `<div class="card-img-top img-default">${elt.title}</div>`;
    if (i < 3) {
      carouselItem1.innerHTML += `<div class="col-md-3 col-sm-6 col-12">${marqueurMovie}
      </div>`;
    } if (i >= 3 && i < 6) {
      carouselItem2.innerHTML += `<div class="col-md-3 col-sm-6 col-12">${marqueurMovie}
      </div>`;
    } if (i >= 6 && i < 9) {
      carouselItem3.innerHTML += `<div class="col-md-3 col-sm-6 col-12">${marqueurMovie}
      </div>`;
    } if (i >= 9) {
      carouselItem4.innerHTML += `<div class="col-md-3 col-sm-6 col-12">${marqueurMovie}
      </div>`;
    }
  });
};
