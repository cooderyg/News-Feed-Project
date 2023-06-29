// 모달
const modal = document.getElementById('modal');
function modalOn() {
  modal.classList.add('on');
}
function modalOff() {
  modal.classList.remove('on');
}
const btnModal = document.querySelector('.profile-write');
btnModal.addEventListener('click', modalOn);

const closeBtn = modal.querySelector('.close-area');
modal.addEventListener('click', function (e) {
  if (e.target === this) {
    modalOff();
  }
});
closeBtn.addEventListener('click', modalOff);
