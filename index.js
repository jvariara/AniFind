const searchValue = document.getElementById("search");

function storeAnime() {
  localStorage.setItem("anime", searchValue.value);
  window.location.href = `${window.location.origin}/html/findyouranime.html`;
}
