let animeData;
let animeList;
let animeDescData;
let animeDesc;
let charsData;
let charsList;
let char;
let charList;
let charArray = [];

const searchValue = document.getElementById("search");

function storeAnime() {
  localStorage.setItem("anime", searchValue.value);
  searchAnime();
}

async function searchAnime(filter) {
  const animeWrapper = document.querySelector(".animes");

  animeWrapper.classList += " anime__loading";
  if (!animeData) {
    animeData = await getAnimeData();
    animeList = animeData.data.slice(0, 9);
  }
  animeWrapper.classList.remove("anime__loading");
  if (filter === "HIGH_TO_LOW") {
    animeList.sort(
      (a, b) => b.attributes.averageRating - a.attributes.averageRating
    );
  } else if (filter === "LOW_TO_HIGH") {
    animeList.sort(
      (a, b) => a.attributes.averageRating - b.attributes.averageRating
    );
  } else if (filter === "POPULARITY") {
    animeList.sort(
      (a, b) => a.attributes.popularityRank - b.attributes.popularityRank
    );
  }

  const animeListElem = document.querySelector(".animes");
  animeListElem.innerHTML = animeList.map((anime) => animeHTML(anime)).join("");
}

function filterAnime(event) {
  searchAnime(event.target.value);
}

function getAnimeId(event) {
  const animeTitle = event.target.innerHTML;
  localStorage.setItem("animeTitle", animeTitle);
  window.location.href = `${window.location.origin}/anifind/html/description.html`;
}

async function loadAnimeDescription() {
  const descriptionWrapper = document.querySelector(".description__container");

  if (!animeDesc){
    animeDesc = await getAnimeDescription();
    animeDescData = animeDesc.data;
  }
  
  descriptionWrapper.innerHTML = descriptionHTML(animeDescData);
  document.getElementById(
    "background__overlay"
    ).style.backgroundImage = `url(${animeDescData.attributes.coverImage.original})`;
}

async function loadCharacterData() {
  await loadAnimeDescription();

  const characterWrapper = document.querySelector(".description__characters");

  if (!charsData) {
    charsData = await getCharactersData();
    charsList = charsData.data.slice(0, 6);
  }
  

  for (let i = 0; i < charsList.length; i++) {
    charList = await getCharacter(charsList[i].id);
    charArray.push(charList.data);
  }
  
  characterWrapper.innerHTML = charArray.map(elem => characterHTML(elem)).join("");
}

loadCharacterData();
searchAnime();

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
      <div class="anime__title" onclick="getAnimeId(event)">${
        anime.attributes.titles.en || anime.attributes.canonicalTitle
      }</div>
      <div id="anime__popularity">
        Rank: <span id="rank">${anime.attributes.popularityRank}</span>
      </div>
      <div id="anime__rating">
        Rating: <span id="rating">${anime.attributes.averageRating}</span>
      </div>
    </a>
  </div>`;
}

function descriptionHTML(anime) {
  return `<div class="description__container">
  <figure class="description__poster--wrapper">
    <img
      src="${anime.attributes.posterImage.original}"
      alt=""
      class="description__poster"
    />
  </figure>
  <div class="description__content--container">
    <div class="description__header--container">
      <h1 class="description__header--title">${
        anime.attributes.titles.en || anime.attributes.canonicalTitle
      }</h1>
      <h1 class="description__header--rank">
        Rank: <span>${anime.attributes.popularityRank}</span>
      </h1>
      <h1 class="description__header--status">
        Status: <span>${anime.attributes.status}</span>
      </h1>
    </div>
    <div class="description__dc--container">
      <div class="description__description--container">
        <h1 class="description__description--title">
          Description:
        </h1>
        <p class="description__description--para">${
          anime.attributes.description || anime.attributes.synopsis
        }</p>
      </div>
      <div class="description__characters--container">
          <h1 class="description__characters--title">Characters:</h1>
          <div class="description__characters"></div>
    </div>
  </div>`;
}

function characterHTML(character) {
  return `<div class="description__character">
  <figure class="character__img--wrapper">
      <img src="${getImage(character)}" alt="${
    character.attributes.names.en || character.attributes.canonicalName
  }" class="character__img">
  </figure>
  <h2 class="character__name">${
    character.attributes.names.en || character.attributes.canonicalName
  }</h2>
</div>`;
}

function getImage(characterImg) {
  if (!characterImg) {
    return
  }
  let img = characterImg.attributes.image.original
  return img
}

async function getAnimeData() {
  const animeFromSearch = localStorage.getItem("anime");
  const anime = await fetch(
    `https://kitsu.io/api/edge/anime?filter[text]=${animeFromSearch}`
  );
  const animeData = await anime.json();
  document.querySelector(".anime__searched").innerHTML = `${animeFromSearch}:`;
  return animeData;
}

async function getAnimeDescription() {
  const animeTitleStored = localStorage.getItem("animeTitle");
  const animeDescription = await fetch(
    `https://kitsu.io/api/edge/anime?filter[text]=${animeTitleStored}`
  );
  const animeDescriptionData = await animeDescription.json();
  const animeId = animeDescriptionData.data[0].id;
  localStorage.setItem("animeID", animeId);

  const description = await fetch(`https://kitsu.io/api/edge/anime/${animeId}`);
  const descriptionData = await description.json();
  return descriptionData;
}

async function getCharactersData() {
  const animeId = localStorage.getItem("animeID");
  const characters = await fetch(
    `https://kitsu.io/api/edge/anime/${animeId}/characters`
  );
  const charactersData = await characters.json();
  return charactersData;
}

async function getCharacter(id) {
  const character = await fetch(
    `https://kitsu.io/api/edge/media-characters/${id}/character`
  );
  const characterData = await character.json();
  return characterData;
}
