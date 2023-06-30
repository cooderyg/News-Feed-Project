const PlaceId = window.location.pathname.split('/')[2];
const likeButton = document.getElementById('heartIcon');
const heart = document.getElementById('heart');

function liked() {
  heart.classList.remove('fa-heart-o');
  heart.classList.add('fa-heart');
}

function unLiked() {
  heart.classList.remove('fa-heart');
  heart.classList.add('fa-heart-o');
}

likeButton.addEventListener('click', function () {
  likeButton.classList.toggle('active');

  if (likeButton.classList.contains('active')) {
    fetch(`/api/likes/${PlaceId}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'like' }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log('좋아요 동작을 처리하지 못했습니다.');
        }
      })
      .then((data) => {
        console.log(data);
        if (data.liked) {
          liked();
        } else {
          unLiked();
        }
        likeButton.classList.toggle('active');
      })
      .catch((error) => {
        const confirm = window.confirm('로그인 이후 사용가능합니다. 로그인 하시겠습니까?');
        if (confirm) {
          location.href = `/login?redirect=${window.location}`;
        }

        console.log('오류가 발생했습니다:', error);
      });
  }
});
