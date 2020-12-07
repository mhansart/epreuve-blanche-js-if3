import './style.scss';
import { movies } from './src/data/movies';
import { uniqueArray, render } from './src/helpers/functions';

// Aller récupérer le local storage et s'il existe, moviesLike = local storage
let moviesData = localStorage.getItem('moviesliked');
let moviesLike;
if (moviesData) {
  moviesLike = JSON.parse(moviesData);
} else {
  moviesLike = [];
}

// fonction pour stocker les données avec le local storage
const stockData = (tab) => {
  window.localStorage.setItem('moviesliked', JSON.stringify(tab));
  moviesData = localStorage.getItem('moviesliked');
};

const sortByMapped = (map, compareFn) => (a, b) => compareFn(map(a), map(b));
const byValue = (a, b) => a - b;
const toNote = (e) => e.note;
const byNote = sortByMapped(toNote, byValue);
const carouselDefault = [];
const moviesGenre = [];

movies.forEach((movie) => {
  // Tableau pour rempli le carousel par défaut si rienn'a été liké
  if (carouselDefault.length < 12) {
    carouselDefault.push(movie);
  }
  // Si le local storage n'existe pas
  // remplir le tableau moviesLike avec un marqueur et la mention like à false
  const marqueur = (movie.img === false) ? movie.title : movie.imdb;
  if (moviesLike.length <= movies.length) {
    moviesLike.push({ marqueur: `${marqueur}`, like: false });
  }
  // remplir un tableau avec tous les genres existants
  movie.genres.forEach((genre) => {
    moviesGenre.push(genre.trim());
  });
});

const body = document.querySelector('body');
body.innerHTML = `<div id="overlay"></div><div id='one-modal'></div>${body.innerHTML}`;
const container = document.getElementById('app');
container.classList.add('container');
// remplir le container avec titre/select/la modal/...
container.innerHTML = `<h1>Hackerflix</h1>
                       <h3>Vous pourriez aimer:</h3>
                       <div class="carousel-container">
                        <i class="fas fa-chevron-left go-left"></i>
                        <i class="fas fa-chevron-right go-right"></i>
                        <div class="carousel"></div>
                       </div>
                       <div class="description-btn">
                        <p>Trier par Genre:</p><p>Trier par notes:</p>
                       </div>
                       <div class="btn-tri">
                        <div class="selects">
                          <select id="select-genre" class="tri select-css custom-select">
                              <option class="opt-genre" value="tout voir">Tout voir</option>
                          </select>
                          <select id="select-note" class="tri select-css custom-select">
                              <option class="opt-note" value="croissante">Croissant</option>
                              <option class="opt-note" value="decroissante">Décroissant</option>
                          </select>
                          </div>
                          <div id="recent-film" class="tri">Recent films only</div>
                       </div>
                       <div id="movies-container"></div>`;

//  Aller chercher tous les éléments
const optionGenre = document.getElementById('select-genre');
const optionNote = document.getElementById('select-note');
const recentMovies = document.getElementById('recent-film');
const moviesContainer = document.getElementById('movies-container');
const modal = document.getElementById('one-modal');
const overlay = document.getElementById('overlay');
const carousel = document.querySelector('.carousel');
const carouselContainer = document.querySelector('.carousel-container');

// fonction pour mettre des images dans le carrousel
const inCarrousel = () => {
  const pictureInCarrousel = [];
  const genresInCarrousel = [];
  moviesLike.forEach((movie) => {
    // trouver les éléments qui sont à true
    const marqueurOfLike = (movie.like) ? movie.marqueur : '';
    if (marqueurOfLike !== '') {
    // retrouver le film qui est à true dans le tableau movies
      const movieGenreId = movies.indexOf(
        movies.find((movie) => movie.title === marqueurOfLike || movie.imdb === marqueurOfLike),
      );
      // Push dans un tableau, tous les genres liké avec une note qui commence à 1.
      // Si le même genre revient, note +1
      movies[movieGenreId].genres.forEach((genre) => {
        if (genresInCarrousel.length === 0) {
          genresInCarrousel.push({ category: `${genre}`, note: 1 });
        } else {
          const isInArray = genresInCarrousel.map((category) => category.category);
          if (isInArray.includes(genre)) {
            const idOfGenre = isInArray.indexOf(genre);
            genresInCarrousel[idOfGenre].note += 1;
          } else {
            genresInCarrousel.push({ category: `${genre}`, note: 1 });
          }
        }
      });
    }
  });
  // trier le tableau par ordre décroissant
  genresInCarrousel.sort(byNote).reverse();
  movies.forEach((movie) => {
    if (genresInCarrousel.length > 0) {
      for (let i = 0; i < genresInCarrousel.length; i++) {
        if (!pictureInCarrousel.includes(movie)) {
          // tant que le tableau n'est pas rempli avec 12 films,
          // on va chercher les films qui ont le même genre que le genre liké en [0], puis en [1]
          // jusqu'à avoir 12 films différents dans le tableau.
          if (pictureInCarrousel.length < 12) {
            if (movie.genres.includes(genresInCarrousel[i].category)) {
              pictureInCarrousel.push(movie);
            }
          }
        }
      }
    }
  });
  // on les affiche dans le carousel
  render(pictureInCarrousel, moviesLike, carousel);
};

// vérifier si un film a déjà été liké. non => carousel par défaut oui => inCarousel
const isLiked = moviesLike.filter((elt) => elt.like);
(isLiked.length > 0) ? inCarrousel() : render(carouselDefault, moviesLike, carousel);
render(movies, moviesLike, moviesContainer);

// rendre unique le tableau des genres => créer les options du select
const uniqueMoviesGenre = uniqueArray(moviesGenre);
uniqueMoviesGenre.forEach((genre) => {
  optionGenre.innerHTML += `<option class="opt-genre" value="${genre}">${genre}</option>`;
});

// fonction de tri
// Par note, ensuite par genre, ensuite si le film est récent ou pas.
const toSortBy = () => {
  // trier par ordre croissant ou décroissant le tableau movies
  movies.sort(byNote);
  const filmsShown = optionNote.value === 'croissante' ? movies : movies.reverse();
  // Aller chercher les films qui ont seulement le genre voulu
  const moviesByGenre = optionGenre.value === 'tout voir' ? filmsShown : filmsShown.map((movie) => (movie.genres
    .map((genre) => genre.trim())
    .includes(optionGenre.value) ? movie : null));
  // Si le bouton film récent à la classe active, on enlève les anciens films
  const filmAfter2000 = moviesByGenre.map((movie) => (movie !== null && movie.year > 2000 ? movie : null));
  const arrOfMovies = recentMovies.classList.contains('active') ? filmAfter2000 : moviesByGenre;
  render(arrOfMovies, moviesLike, moviesContainer);
};
toSortBy();

// donner une value left = 0 au carousel
carousel.style.left = 0;
// clic sur le body
body.addEventListener('click', (e) => {
  let movieId;
  // Si on clique sur une image
  if (e.target.classList.contains('card-img-top')) {
    // Si c'est un carré de couleur => aller chercher le titre
    if (e.target.classList.contains('img-default')) {
      movieId = movies.indexOf(
        movies.find((movie) => movie.title === e.target.innerHTML),
      );
      // Si c'est une image => aller chercher le nom de l'image
    } else {
      const imgOfMovie = (e.target.getAttribute('src'));
      movieId = movies.indexOf(
        movies.find((movie) => movie.imdb === imgOfMovie.substring(0, imgOfMovie.length - 4)),
      );
    }
    // remplir la modal avec les infos du film cliqué
    modal.innerHTML = `<span class="close-btn"><i class="fa fa-times close"></i></span>
                             <h4>${movies[movieId].title}</h4>
                             <p>${movies[movieId].plot}</p>
                             <p>${movies[movieId].note}/10</p>
                             <p class="genres">Genres: </p> `;
    const classGenres = document.querySelector('.genres');
    movies[movieId].genres.forEach((genre, i) => {
      const oneGenre = i === movies[movieId].genres.length - 1 ? genre : `${genre}, `;
      classGenres.innerHTML += `${oneGenre}`;
    });
    // faire apparaitre modal+overlay
    modal.style.display = 'flex';
    overlay.classList.toggle('d-flex');

  // Si on clique sur la croix pour fermer la modal
  } else if (e.target.classList.contains('close')) {
    modal.style.display = 'none';
    overlay.classList.toggle('d-flex');
    modal.innerHTML = '';

    // Si on clique sur un coeur
  } else if (e.target.classList.contains('fa-heart')) {
    const imgSiblings = e.target.closest('.card-container').querySelector('.card-img-top');
    let movieLikeId;
    // retrouver le film dans le tableau moviesLike grâce à l'image ou au titre
    // Si l'image est un carré de couleur
    if (imgSiblings.classList.contains('img-default')) {
      movieLikeId = moviesLike.indexOf(
        moviesLike.find((movie) => movie.marqueur === imgSiblings.innerHTML),
      );
      // ou est une image
    } else {
      const marqueurOfMovie = (imgSiblings.getAttribute('src'));
      movieLikeId = moviesLike.indexOf(
        moviesLike.find((movie) => movie.marqueur === marqueurOfMovie.substring(0, marqueurOfMovie.length - 4)),
      );
    }
    // mettre un coeur plein/vide
    // changer le false => true  true =>false
    if (e.target.classList.contains('fa-heart')) {
      if (e.target.classList.contains('far')) {
        e.target.classList.replace('far', 'fas');
        moviesLike[movieLikeId].like = true;
      } else {
        e.target.classList.replace('fas', 'far');
        moviesLike[movieLikeId].like = false;
      }
      // générer le carousel + stock des données => local storage
      inCarrousel();
      stockData(moviesLike);
    }
    // Clique sur la flèche à droite du carousel
    // décaler le contenu de 25% de sa largeur vers la droite
  } else if (e.target.classList.contains('go-right')) {
    const previousWidth = parseInt(getComputedStyle(carouselContainer).width, 10);
    if (carousel.style.left !== `-${previousWidth * 2}px`) {
      const previousLeft = carousel.style.left;
      const leftValue = parseFloat(previousLeft) - (previousWidth / 4);
      carousel.style.left = `${leftValue}px`;
    }
    // Clique sur la flèche à gauche du carousel
    // décaler le contenu de 25% de sa largeur vers la gauche
  } else if (e.target.classList.contains('go-left')) {
    if (carousel.style.left !== '0px') {
      const previousWidth = parseInt(getComputedStyle(carouselContainer).width, 10);
      const previousLeft = carousel.style.left;
      const leftValue = parseFloat(previousLeft) + (previousWidth / 4);
      carousel.style.left = `${leftValue}px`;
    }
  }
});

//  Si on clique sur un bouton de tri
const btnForSort = document.querySelectorAll('.tri');
btnForSort.forEach((btn) => {
  if (btn.id === 'recent-film') {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      toSortBy();
    });
  } else {
    btn.addEventListener('change', () => {
      toSortBy();
    });
  }
});
