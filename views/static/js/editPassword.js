const currentPassword = document.getElementById('currentPassword');
const editPassword = document.getElementById('editPassword');
const editConfirmPassword = document.getElementById('editConfirmPassword');
const editBtn = document.querySelector('.buttonPassword');

editBtn.addEventListener('click', async () => {
  const api = await fetch('/api/users/editpassword', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(new editPasswordData()),
  });

  const result = await api.json();

  alert(result.message);
  if (result.message == '비밀번호가 정상 변경되어 새로운 비밀번호로 로그인이 필요합니다.') return (window.location.href = '/login');
});

class editPasswordData {
  constructor() {
    this.currentPassword = currentPassword.value;
    this.editPassword = editPassword.value;
    this.editConfirmPassword = editConfirmPassword.value;
  }
}
