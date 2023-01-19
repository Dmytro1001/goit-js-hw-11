import fetchImages from "./js/fetchImages";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';


const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const endCollection = document.querySelector('.end-collection');


let lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 500,
});

let currentPage = 1;
let currentHits = 0;
let searchQuery = '';

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onClickLoadMore)

async function onSearch(evt) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.searchQuery.value;
  currentPage = 1;

  if (searchQuery === '') {
    return
  }

  const response = await fetchImages(searchQuery, currentPage);

  currentHits = response.hits.length;

  if (response.totalHits > 40) {
    loadMoreBtn.classList.remove('is-hidden');
  } else {
    loadMoreBtn.classList.add('is-hidden');
  }

  try {
    if (response.totalHits > 0) {
      Notify.success(`Hooray! We found ${response.totalHits} images.`);
      gallery.innerHTML = '';
      cardImages(response.hits);
      lightbox.refresh();
      endCollection.classList.add('is-hidden');

      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();

      window.scrollBy({
        top: cardHeight * -100,
        behavior: 'smooth',
      });
    }

    if (response.totalHits === 0) {
      gallery.innerHTML = '';
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      loadMoreBtn.classList.add('is-hidden');
      endCollection.classList.add('is-hidden');
    }
  } catch (error) {
    console.log(error);
  }
}

async function onClickLoadMore() {
  currentPage += 1;
  const response = await fetchImages(searchQuery, currentPage);
  cardImages(response.hits);
  lightbox.refresh();
  currentHits += response.hits.length;

  if (currentHits === response.totalHits) {
    loadMoreBtn.classList.add('is-hidden');
    endCollection.remove('is-hidden');
  }
}

function cardImages(obj) {
  const markup = obj.map(obj => `<a class="gallery__item" href="${obj.largeImageURL}">
  <div class="photo-card post">  
     <div class="wrapper">
     <img src="${obj.webformatURL}" alt="${obj.tags}" loading="lazy" />
     </div>
     <div class="info">
       <p class="info-item">
         <b>Likes: ${obj.likes}</b>
       </p>
       <p class="info-item">
         <b>Views: ${obj.views}</b>
       </p>
       <p class="info-item">
         <b>Comments: ${obj.comments}</b>
       </p>
       <p class="info-item">
         <b>Downloads: ${obj.downloads}</b>
       </p>
     </div>
  </div>`).join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

console.log('Test')
