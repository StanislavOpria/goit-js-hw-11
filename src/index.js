import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;
const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;

let name = '';
let page = 1;
const perPage = 40;
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const btnMore = document.querySelector('.load-more');

btnMore.classList.add('hidden');

form.addEventListener('submit', searchImages);
btnMore.addEventListener('click', debounce(loadMore, DEBOUNCE_DELAY));

function searchImages(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  btnMore.classList.add('hidden');
  page = 1;
  name = e.currentTarget.elements.searchQuery.value;
  renderGallery(name);
}

async function fetchImages(name) {
  const galleryObject = await axios.get(
    `https://pixabay.com/api/?key=33963578-40585d75b8e2e6d6690e20bc4&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  if (!galleryObject.status === 200) {
    throw new Error(galleryObject.status);
  }
  if (galleryObject.data.hits.length === 0) {
    return;
  }
  btnMore.classList.remove('hidden');
  limitOfShows(galleryObject.data.totalHits);
  page += 1;
  return galleryObject;
}

async function renderGallery(name) {
  try {
    const galleryObject = await fetchImages(name);
    const galleryArray = galleryObject.data.hits;
    const markup = galleryArray
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<div class="photo-card">
  <img width = 300 height = 200 src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
        }
      )
      .join('');
    gallery.insertAdjacentHTML('beforeend', markup);
  } catch {
    btnMore.classList.add('hidden');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function loadMore(e) {
  renderGallery(name);
}

function limitOfShows(limit) {
  if (page * perPage > limit) {
    Notify.info(
      'We are sorry, but you have reached the end of search results.'
    );
    btnMore.classList.add('hidden');
  }
}
