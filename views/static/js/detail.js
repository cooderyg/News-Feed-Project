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

printRatingResult(ratingResult);

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

// console.log(typeof printRatingResult());

const uploadEl = document.querySelector('.upload');
const uploadInputEl = document.querySelector('.upload-input');
const uploadContainerEl = document.querySelector('.upload-container');
const reviewBtn = document.querySelector('.review-btn');
const reviewText = document.querySelector('.review-text');
let url;
uploadEl.addEventListener('click', () => {
  uploadInputEl.click();
});

uploadInputEl.addEventListener('change', async (e) => {
  console.log(e.target.files[0].type);
  const file = e.target.files[0];
  if (file.size > 1 * 1024 * 1024) {
    alert('파일용량은 최대 1mb입니다.');
    return;
  }
  if (!file.type.includes('jpeg') && !file.type.includes('png')) {
    alert('jpeg 또는 png 파일만 업로드 가능합니다!');
    return;
  }
  let formData = new FormData();
  formData.append('photo', file);
  const response = await fetch('./api/files', {
    method: 'POST',
    body: formData,
  });
  url = await response.json();
  console.log(url);
  uploadContainerEl.innerHTML = `
  <img src="${url.data}" />
  `;
});

// reviewBtn.addEventListener('click', () => {
//   console.log(url);
//   if (reviewText.value.length < 10) {
//     alert('10자 이상으로 작성해주세요!');
//     return;
//   }
//   fetch('./api/review', {
//     method: post,
//     body: {
//       content: reviewText.value,
//       imageUrl: url.data,
//       star: printRatingResult(),
//     },
//   });
// });

// 좋아요 기능 구현
const heartIcon = document.getElementById('heartIcon');
let isLiked = false;
heartIcon.addEventListener('click', function () {
  isLiked = !isLiked;

  const placeId = 'placeId';
  const apiUrl = `http://localhost:3000/detail/${placeId}`;

  const requestBody = {
    PlaceId: placeId,
    bool: isLiked,
  };

  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then(handleResponse)
    .catch((error) => {
      console.error('오류가 발생했습니다.', error);
      // 에러 처리 로직 추가
    });

  function handleResponse(data) {
    if (data.liked) {
      heartIcon.classList.add('liked');
    } else {
      heartIcon.classList.remove('liked');
    }
  }
});
