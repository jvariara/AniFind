function storeSearchElem(event) {
  const animeSearch = event.target.value;
  localStorage.setItem("anime", animeSearch);
  window.location.href = `${window.location.origin}/html/findyouranime.html`;
}