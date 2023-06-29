const searchBtn = document.querySelector('.searchBtn');
const searchBox = document.getElementById('searchBox');

const search = () => {
  if (!searchBox.value) return alert('검색어를 입력해 주세요.');
  window.location.href = `/search?data=${searchBox.value}&page=1`;
};

searchBtn.addEventListener('click', search);
searchBox.addEventListener('keypress', (e) => (e.keyCode == 13 ? search() : null));
searchBox.focus();
