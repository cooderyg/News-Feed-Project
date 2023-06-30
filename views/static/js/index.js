const best12List = document.getElementById('best12list');
const categoriesList = document.getElementById('categoriesList');
const searchBtn = document.querySelector('.searchBtn');
const searchBox = document.getElementById('searchBox');
let lastLi;
const getBest12 = async () => {
  const api = await fetch('./api/places/main/best12');
  const result = await api.json();

  result.forEach((info) => {
    best12List.innerHTML += `<li class="feed-item">
              <a href="/detail/${info.placeId}">
                <div class="img-container">
                  <img src="${info.imageUrl}" style="border-radius : 10px;" />
                </div>
                <h3>
                  ${info.name}
                </h3>
                <p style="color:gray;">${info.foodType}</p>
              </a>
            </li>`;
  });
  lastLi = document.querySelector('.feed-container > li:last-child ');
  //첫 번째 관찰 시작
  io.observe(lastLi);
};

const getCategories = async () => {
  const api = await fetch('./api/placeCategories');
  const { data } = await api.json();

  data.forEach((info, index) => {
    categoriesList.innerHTML += `
    <div class="category-list swiper-slide">
              <a href="/categories/${info.placeCategoryId}">
                <img
                  src="${info.Places[0].imageUrl}"
                  alt="" style="border-radius : 10px; filter : brightness(0.7);" />
                <p>${info.name} 맛집 베스트 Top 20</p>
              </a>
    </div>`;
  });

  const swiper = new Swiper('.swiper-container', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    autoplay: true,
    loop: true,
    spaceBetween: 30,
    slidesPerView: 3,
  });
};

const search = () => {
  if (!searchBox.value) return alert('검색어를 입력해 주세요.');
  window.location.href = `/search?data=${searchBox.value}&page=1`;
};

searchBtn.addEventListener('click', search);
searchBox.addEventListener('keypress', (e) => (e.keyCode == 13 ? search() : null));

getCategories();
getBest12();
searchBox.focus();

// 무한스크롤
let pageCount = 1;
const io = new IntersectionObserver((entries, observer) => {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      pageCount++;
      const ioFetch = async () => {
        const res = await fetch(`/api/places?page=${pageCount}`);
        const rows = await res.json();

        // template.js로 템플릿 제작 순회
        let temp = rows.map((row) => {
          return `
          <li class="feed-item">
            <a href="/detail/${row.placeId}">
              <div class="img-container">
                <img src="${row.imageUrl}" style="border-radius : 10px;" />
              </div>
              <h3>
                ${row.name}
              </h3>
              <p style="color:gray;">${row.foodType}</p>
            </a>
          </li>`;
        });

        // 배열 정리후 데이터바인딩
        let joinTemp = temp.join('');

        best12List.insertAdjacentHTML('beforeend', joinTemp);

        // 기존에 사용한 마지막 li 관찰 종료
        io.unobserve(lastLi);

        // 템플릿 추가후 바뀐 마지막 li 재할당
        lastLi = document.querySelector('.feed-container > li:last-child ');

        // 새로운 마지막 li에 가시성관찰
        io.observe(lastLi);
      };
      // 무한스크롤 패칭
      ioFetch();
    }
  });
});
