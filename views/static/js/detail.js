const placeId = window.location.pathname.split('/')[2];
let isEdit = false;
let isCreated;
const detailpage = async () => {
  const response = await fetch(`/api/places/${placeId}`);
  const result = await response.json();
  console.log(result);
  const { place: data, userId } = result;
  if (userId) {
    const likeResponse = await fetch(`/api/likes/detail/${placeId}`);
    const likeResult = await likeResponse.json();
    console.log(likeResult);
    const heart = document.querySelector('#heart');
    if (likeResult) {
      heart.classList.remove('fa-heart-o');
      heart.classList.add('fa-heart');
    }
  }

  const thumbnailEl = document.querySelector('.thumbnail');
  const titleEl = document.querySelector('.title');
  const infoEl = document.querySelector('.info');
  const menuEl = document.querySelector('.menu');
  const reviewCountEl = document.querySelector('.review-count');
  const reviewUlEl = document.querySelector('.review-ul');
  const modalTitle = document.querySelector('.modal-title');
  const reviewWriteEl = document.querySelector('.review-write');
  const mapEl = document.querySelector('#map');
  //타이틀 삽입
  titleEl.innerText = data.name;
  modalTitle.innerText = data.name;
  //썸네일 삽입
  thumbnailEl.innerHTML = `
    <img src="${data.imageUrl}"/>
  `;
  // 폰번호 가격대 업업시간 nullable
  const phoneNumberTemp = `
    <li>
      <span>전화번호</span>
      <span>${data.phoneNumber}</span>
    </li>
  `;
  const priceRangeTemp = `
    <li>
      <span>전화번호</span>
      <span>${data.priceRange}</span>
    </li>
  `;
  const openingHoursTemp = `
  <li>
    <span>영업시간</span>
    <span>${data.openingHours}</span>
  </li>
`;

  const infoTemp = `
    <li>
      <span>주소</span>
      <span>${data.address}</span>
    </li>
    ${data.phoneNumber ? phoneNumberTemp : ''}
    <li>
      <span>음식 종류</span>
      <span>${data.foodType}</span>
    </li>
    ${data.priceRange ? priceRangeTemp : ''}
    ${data.openingHours ? openingHoursTemp : ''}
  `;
  const btnTemp = `
    <div class="btn-container">
      <button class="edit-btn">수정하기</button>
      <button class="delete-btn">삭제하기</button>
    </div>
  `;
  infoEl.insertAdjacentHTML('afterbegin', infoTemp);
  const MenuTemp = data.Menus.map((menu) => {
    return `
    <li>
      <span>${menu.name}</span>
      <span>${menu.price}</span>
    </li>
    `;
  }).join('');
  menuEl.insertAdjacentHTML('afterbegin', MenuTemp);

  // 지도
  let mapContainer = mapEl, // 지도를 표시할 div
    mapOption = {
      center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
      level: 3, // 지도의 확대 레벨
    };

  // 지도를 생성합니다
  let map = new kakao.maps.Map(mapContainer, mapOption);

  // 주소-좌표 변환 객체를 생성합니다
  let geocoder = new kakao.maps.services.Geocoder();

  // 주소로 좌표를 검색합니다
  geocoder.addressSearch(`${data.address.replace(' 1F', '')}`, function (result, status) {
    // 정상적으로 검색이 완료됐으면
    if (status === kakao.maps.services.Status.OK) {
      let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

      // 결과값으로 받은 위치를 마커로 표시합니다
      let marker = new kakao.maps.Marker({
        map: map,
        position: coords,
      });

      // 인포윈도우로 장소에 대한 설명을 표시합니다
      let infowindow = new kakao.maps.InfoWindow({
        content: `<div style="width:150px;text-align:center;padding:6px 0;">${data.name}</div>`,
      });
      infowindow.open(map, marker);

      // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
      map.setCenter(coords);
    }
  });

  // 리뷰 개수
  reviewCountEl.innerText = `리뷰 ${data.Reviews.length}개`;

  //이미 작성한 리뷰가 있으면 리뷰작성버튼 안보이게 하기
  isCreated = data.Reviews.filter((review) => review.User.userId === userId);
  isCreated.length || !userId ? reviewWriteEl.classList.add('on') : null;
  console.log(isCreated);
  // 리뷰 넣기
  const reviewTemp = data.Reviews.map((review) => {
    const reviewImgTemp = `<img class="review-img" src="${review.ReviewImages[0]?.imageUrl}" alt="" />`;
    return `
    <li data-id="${review.reviewId}">
      <div class="review-container">
        <div class="profile">
          <img src="${review.User.profileImage ? review.User.profileImage : '/img/profile.jpg'}" alt="" />
          <div>${review.User.name}</div>
        </div>
        <div class="label">
          <p>${review.createdAt.slice(0, 10)}</p>
          <p>${review.content}</p>
          ${review.ReviewImages.length ? reviewImgTemp : ''}
        </div>
        <div class="star">
          <div>${review.rating}</div>
          <i class="fa fa-star" aria-hidden="true"></i>
        </div>
        ${review.reviewId === isCreated[0]?.reviewId ? btnTemp : ''}
      </div>
    </li>
 `;
  }).join('');
  reviewTemp ? (reviewUlEl.innerHTML = reviewTemp) : null;

  reviewUlEl.addEventListener('click', async function (e) {
    const reviewId = e.target.parentNode.parentNode.parentNode.getAttribute('data-id');
    // 리뷰수정로직
    if (e.target.classList.contains('edit-btn')) {
      // alert('수정버튼입니다.');
      const { content, rating } = isCreated[0];
      const imageUrl = isCreated[0].ReviewImages.length ? isCreated[0].ReviewImages[0].imageUrl : null;
      if (imageUrl) {
        uploadContainerEl.innerHTML = ` 
        <img src="${imageUrl}" />
        <button class="img-update-btn">이미지 수정</button>
        `;
        const imgUpdateBtnEl = document.querySelector('.img-update-btn');
        imgUpdateBtnEl.addEventListener('click', () => {
          uploadInputEl.click();
        });
      }
      const starEls = ratingEl.querySelectorAll('.fa');
      starEls[rating - 1].click();
      reviewText.value = content;
      isEdit = true;
      modalOn();
    }

    // 리뷰삭제로직
    if (e.target.classList.contains('delete-btn')) {
      // alert('삭제버튼입니다.');
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.data === '리뷰를 삭제하였습니다.') {
        location.reload();
      } else {
        alert(result.data);
      }
    }
  });
};
detailpage();

// 모달
const modal = document.getElementById('modal');
function modalOn() {
  modal.classList.add('on');
}
function modalOff() {
  modal.classList.remove('on');
}
const btnModal = document.querySelector('.review-write');
btnModal.addEventListener('click', modalOn);

const closeBtn = modal.querySelector('.close-area');
modal.addEventListener('click', function (e) {
  if (e.target === this) {
    modalOff();
  }
});
closeBtn.addEventListener('click', modalOff);

// 별점
const ratingStars = [...document.getElementsByClassName('rating__star')];
const ratingResult = document.querySelector('.rating__result');
const ratingEl = document.querySelector('.rating');
function executeRating(stars, result) {
  const starClassActive = 'rating__star fa fa-star';
  const starClassUnactive = 'rating__star fa fa-star-o';
  const starsLength = stars.length;
  let i;
  stars.map((star) => {
    star.onclick = () => {
      i = stars.indexOf(star);

      if (star.className.indexOf(starClassUnactive) !== -1) {
        printRatingResult(result, i + 1);
        for (i; i >= 0; --i) stars[i].className = starClassActive;
      } else {
        printRatingResult(result, i);
        for (i; i < starsLength; ++i) stars[i].className = starClassUnactive;
      }
    };
  });
}

function printRatingResult(result, num = 0) {
  return num + 1;
}
executeRating(ratingStars, ratingResult);

const uploadEl = document.querySelector('.upload');
const uploadInputEl = document.querySelector('.upload-input');
const uploadContainerEl = document.querySelector('.upload-container');
const reviewBtn = document.querySelector('.review-btn');
const reviewText = document.querySelector('.review-text');
let url;

uploadEl.addEventListener('click', () => {
  uploadInputEl.click();
});

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
//   url = await response.json();
//   console.log(url);
//   uploadContainerEl.innerHTML = `
//   <img src="${url.data}" />
//   <button class="img-update-btn">이미지 수정</button>
//   `;
//   const imgUpdateBtnEl = document.querySelector('.img-update-btn');
//   imgUpdateBtnEl.addEventListener('click', () => {
//     uploadInputEl.click();
//   });
// });

reviewBtn.addEventListener('click', async () => {
  const content = reviewText.value;
  const rating = ratingEl.querySelectorAll('.fa-star').length;
  const form = JSON.stringify({
    content,
    // imageUrl: url ? url.data : null,
    imageUrl: 'https://mp-seoul-image-production-s3.mangoplate.com/added_restaurants/639648_1476361064493618.jpg?fit=around|512:512&crop=512:512;*,*&output-format=jpg&output-quality=80',
    rating,
  });
  if (reviewText.value.length < 10) {
    alert('10자 이상으로 작성해주세요!');
    return;
  }
  // 수정
  if (isEdit) {
    const response = await fetch(`/api/reviews/${isCreated[0].reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: form,
    });
    const data = await response.json();
    if (data.data === '리뷰를 수정하였습니다.') {
      location.reload();
    } else {
      alert('리뷰수정에 실패했습니다. 다시 한번 확인해주세요!');
    }
  } else {
    const response = await fetch(`/api/reviews/${placeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: form,
    });
    const data = await response.json();
    if (data.message === '리뷰 작성에 성공하였습니다.') {
      location.reload();
    } else {
      alert('리뷰작성에 실패했습니다. 다시 한번 확인해주세요!');
    }
  }
});
