const likesList = document.getElementById('likesList');
const likesCount = document.getElementById('likesCount');
const pageNumBox = document.querySelector('.buttons');
const profileName = document.querySelector('.profile-name');
const profileIntroduction = document.querySelector('.profile-introduction');
const boxImgEl = document.querySelector('.box-img');
const titleNameEl = document.querySelector('.title-name');
const getUser = async () => {
  const response = await fetch('/api/users');
  const result = await response.json();
  const { name, introduction, profileImage } = result.user;
  profileName.innerText = name;
  titleNameEl.innerText = name;
  nameTextEl.value = name;
  profileIntroduction.innerText = introduction;
  introduceTextEl.value = introduction;
  if (profileImage) {
    boxImgEl.setAttribute('src', profileImage);
    profileImgEl.setAttribute('src', profileImage);
  }
};
getUser();
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

const nameTextEl = document.querySelector('.name-text');
const introduceTextEl = document.querySelector('.introduce-text');
const profileBtnEl = document.querySelector('.profile-btn');
const pictureBtnEl = document.querySelector('.picture-btn');
const uploadInputEl = document.querySelector('.picture-modify');
const profileImgEl = document.querySelector('.profile-img');
const pictureDeleteEl = document.querySelector('.picture-delete');
let url;
// 이미지 클라우드 업로드
// uploadInputEl.addEventListener('change', async (e) => {
//   console.log(e.target.files[0].type);
//   const file = e.target.files[0];
//   if (file.size > 1 * 1024 * 1024) {
//     alert('파일용량은 최대 1mb입니다.');
//     return;
//   }
//   if (!file.type.includes('jpeg') && !file.type.includes('png')) {
//     alert('jpeg 또는 png 파일만 업로드 가능합니다!');
//     return;
//   }
//   let formData = new FormData();
//   formData.append('photo', file);
//   const response = await fetch('/api/files', {
//     method: 'POST',
//     body: formData,
//   });
//   const { data } = await response.json();
//   console.log(data);
//   url = data;
//   profileImgEl.setAttribute('src', url);
// });

pictureBtnEl.addEventListener('click', () => {
  uploadInputEl.click();
});
profileBtnEl.addEventListener('click', async () => {
  const name = nameTextEl.value;
  const introduction = introduceTextEl.value;
  const form = JSON.stringify({
    name,
    introduction,
    // profileImage: url ? url : null,
    profileImage: 'https://mp-seoul-image-production-s3.mangoplate.com/added_restaurants/639648_1476361064493618.jpg?fit=around|512:512&crop=512:512;*,*&output-format=jpg&output-quality=80',
  });
  // 수정
  const response = await fetch('/api/users', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: form,
  });
  const data = await response.json();
  if (data.message === '수정에 성공하였습니다.') {
    alert(data.message);
    location.reload();
  }
});

pictureDeleteEl.addEventListener('click', () => {
  url = '';
  profileImgEl.setAttribute('src', '/img/profile.jpg');
});
