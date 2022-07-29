/**
 * Getting the titles: animeData.data[0].attributes.titles.en || animeData.data[0].attributes.canonicalTitle
 * Getting the poster: animeData.data[0].attributes.posterImage.original
 * Getting the cover image: animeData.data[0].attributes.coverImage.original
 * Getting the status (Finished/Current): animeData.data[0].attributes.status
 * Getting the description: animeData.data[0].attributes.description
 */

/**
 * Ways to sort:
 *
 * Average Rating: animeData.data[0].attributes.averageRating
 * Popularity Rank (Increasing/Decreasing): animeData.data[0].attributes.popularityRank
 * Rating Rank (Increasing/Decreasing): animeData.data[0].attributes.ratingRank
 */
let animeData;
let animeList;
const searchValue = document.getElementById('search')

function storeAnime() {
  localStorage.setItem("anime", searchValue.value);
  searchAnime();
}

async function searchAnime(filter) {
    const animeWrapper = document.querySelector(".animes")

    animeWrapper.classList += ' anime__loading'
    if (!animeData) {
        animeData = await getAnimeData();
        animeList = animeData.data;
    }
    animeWrapper.classList.remove('anime__loading')
    if (filter === 'HIGH_TO_LOW') {
        animeList.sort((a, b) => b.attributes.averageRating - a.attributes.averageRating)
    } else if (filter === 'LOW_TO_HIGH') {
        animeList.sort((a, b) => a.attributes.averageRating - b.attributes.averageRating)
    } else if (filter === 'POPULARITY') {
        animeList.sort((a, b) => a.attributes.popularityRank - b.attributes.popularityRank)
    }

  const animeListElem = document.querySelector(".animes");
  animeListElem.innerHTML = animeList.map((anime) => animeHTML(anime)).join("");
}

function filterAnime(event) {
  searchAnime(event.target.value);
}

searchAnime()

function animeHTML(anime) {
  return `<div class="anime">
    <a href="#">
      <figure class="anime__poster--wrapper">
        <img
          src="${anime.attributes.posterImage.original}"
          alt=""
          class="anime__poster"
        />
      </figure>
      <div class="anime__title">${
        anime.attributes.titles.en || anime.attributes.canonicalTitle
      }</div>
      <div class="anime__popularity">
        Rank: <span class="rank">${anime.attributes.popularityRank}</span>
      </div>
      <div class="anime__rating">
        Rating: <span class="rating">${anime.attributes.averageRating}</span>
      </div>
    </a>
  </div>`;
}

async function getAnimeData() {
  const animeFromSearch = localStorage.getItem("anime");
  const anime = await fetch(
    `https://kitsu.io/api/edge/anime?filter[text]=${animeFromSearch}`
  );
  const animeData = await anime.json();
  document.querySelector('.anime__searched').innerHTML = `${animeFromSearch}:`
  return animeData
}
