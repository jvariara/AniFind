const searchValue = document.getElementById("search");
const currWindow = window.location.href

function storeAnime() {
  localStorage.setItem("anime", searchValue.value);
  window.location.href = `${window.location.origin}/anifind/html/findyouranime.html`;
}
