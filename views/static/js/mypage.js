const likesList = document.getElementById('likesList');
const likesCount = document.getElementById('likesCount');
const pageNumBox = document.querySelector('.buttons');

const getLike = async () => {
  const params = new URL(document.location).searchParams;
  const currentPage = params.get('page') ?? 1;

  const api = await fetch(`/api/likes/user/mylike?page=${currentPage}`);
  const result = await api.json();
  const page = result.page;

  likesCount.innerText = result.data.count;

  result.data.list.forEach((info) => {
    likesList.innerHTML += `<div class="courses-container" onclick="window.location.href='/detail/${info.placeId}'">
      <div class="course">
        <img
          src="${info.imageUrl}"
          class="course-preview" />
        <div class="course-info">
          <h6 style="font-size: 13px">${info.address}</h6>
          <h2 style="font-size: 24px; font-weight: 600">${info.name}</h2>
          <p style="color: gray; font-size: 14px">${info.foodType}</p>

        </div>
        <i class="fa fa-heart" aria-hidden="true"></i>
      </div>
    </div>`;
  });

  console.log(page);

  if (page.min !== 1) {
    pageNumBox.innerHTML += ` <a class="button" href="?page=${page.min - 1}"><</a>`;
  }

  for (i = page.min; i <= page.max; i++) {
    if (page.maxPageCount > i) {
      if (page.present * 1 !== i) {
        pageNumBox.innerHTML += ` <a class="button" href="?page=${i}">${i}</a>`;
      } else {
        console.log(i);
        pageNumBox.innerHTML += ` <a class="button active" href="?page=${i}">${i}</a>`;
      }
    }
  }

  if (page.max < page.maxPageCount) {
    pageNumBox.innerHTML += `<a class="button" href="?page=${page.max + 1}"> > </a>`;
  }
};

getLike();

//modal 영역
const modal = document.getElementById('modal');

function modalOn() {
  modal.classList.add('on');
}
function modalOff() {
  modal.classList.remove('on');
}
const btnModal = document.querySelector('.profile-write');
btnModal.addEventListener('click', modalOn);

const closeBtn = document.querySelector('.close-area');
modal.addEventListener('click', function (e) {
  if (e.target === this) {
    modalOff();
  }
});

closeBtn.addEventListener('click', modalOff);
