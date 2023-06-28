const best12List = document.getElementById('best12list');
const categoriesList = document.getElementById('categoriesList');

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
                <p>${info.name} 맛집 베스트</p>
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

getCategories();
getBest12();
