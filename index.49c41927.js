let e="",n=1;const t=document.getElementById("search-form"),a=document.querySelector(".gallery"),o=document.querySelector(".load-more");async function s(e){const t=await fetch(`https://pixabay.com/api/?key=33963578-40585d75b8e2e6d6690e20bc4&q=${e}&image_type=photo&orientation=horizontal&safesearch=true&page=${n}&per_page=150`);if(!t.ok)throw new Error(t.status);const a=await t.json();var o;if(0!==a.hits.length)return o=a.totalHits,150*n>o&&console.log("To much!!!"),n+=1,a}async function i(e){try{const n=await s(e),t=n.hits.map((({webformatURL:e,largeImageURL:n,tags:t,likes:a,views:o,comments:s,downloads:i})=>`<div class="photo-card">\n  <img width = 300 src="${e}" alt="${t}" loading="lazy" />\n  <div class="info">\n    <p class="info-item">\n      <b>Likes: ${a}</b>\n    </p>\n    <p class="info-item">\n      <b>Views: ${o}</b>\n    </p>\n    <p class="info-item">\n      <b>Comments: ${s}</b>\n    </p>\n    <p class="info-item">\n      <b>Downloads: ${i}</b>\n    </p>\n  </div>\n</div>`)).join("");a.insertAdjacentHTML("beforeend",t)}catch{console.log("Sorry, there are no images matching your search query. Please try again.")}}t.addEventListener("submit",(function(t){t.preventDefault(),a.innerHTML="",n=1,e=t.currentTarget.elements.searchQuery.value,i(e)})),o.addEventListener("click",(function(n){i(e)}));
//# sourceMappingURL=index.49c41927.js.map