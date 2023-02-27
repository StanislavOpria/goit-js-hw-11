import './css/styles.css';

let name = '';
let page = 1;
const perPage = 150;
const DEBOUNCE_DELAY = 300;
const form = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const btnMore = document.querySelector('.load-more');

form.addEventListener('submit', searchImages);
btnMore.addEventListener('click', loadMore);

function searchImages(e) {
  e.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  name = e.currentTarget.elements.searchQuery.value;
  renderGallery(name);
}

function loadMore(e) {
  renderGallery(name);
}

async function fetchImages(name) {
  const responce = await fetch(
    `https://pixabay.com/api/?key=33963578-40585d75b8e2e6d6690e20bc4&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  if (!responce.ok) {
    throw new Error(responce.status);
  }
  const galleryPromise = await responce.json();
  if (galleryPromise.hits.length === 0) {
    return;
  }
  limitOfShows(galleryPromise.totalHits);
  page += 1;
  return galleryPromise;
}

async function renderGallery(name) {
  try {
    const galleryObject = await fetchImages(name);
    const galleryArray = galleryObject.hits;
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
  <img width = 300 src="${webformatURL}" alt="${tags}" loading="lazy" />
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
    console.log(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}

function limitOfShows(limit) {
  if (page * perPage > limit) {
    console.log('To much!!!');
  }
}
