const searchBtn = document.querySelector('.searchBtn');
const searchBox = document.getElementById('searchBox');

const search = () => {
  if (!searchBox.value) return alert('검색어를 입력해 주세요.');
  window.location.href = `/search?data=${searchBox.value}&page=1`;
};

searchBtn.addEventListener('click', search);
searchBox.addEventListener('keypress', (e) => (e.keyCode == 13 ? search() : null));
searchBox.focus();

// 스켈레톤 요소
const skeletonItem = document.querySelectorAll('.skeleton_loading');
// 스켈레톤 요소 전체 삭제
const hideskeleton = () => {
  skeletonItem.forEach((element) => {
    $(element).fadeOut();
  });
};
// 테스트 코드 (페이지 로딩을 위해 2초간 스켈레톤 애니메이션이 보여짐)
// window.onload = setTimeout(hideskeleton, 2000);
// 실제 코드 (실제로 사용될 코드)
window.onload = hideskeleton;
