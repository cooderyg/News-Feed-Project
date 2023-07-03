const userEmail = document.getElementById('userEmail');
const userPassword = document.getElementById('userPassword');
const loginBtn = document.getElementById('loginBtn');

const url = new URL(window.location);
const urlParams = url.searchParams;

userPassword.addEventListener('keydown', (e) => {
  if (e.keyCode === 13) loginBtn.click();
});

loginBtn.addEventListener('click', async () => {
  if (!userEmail.value || !userPassword.value) return alert('아이디와 패스워드 모두 입력해주세요!');

  const api = await fetch('./api/users/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(new loginData()),
  });

  const result = await api.json();

  if (urlParams.get('redirect')) {
    if (result.message == '로그인 성공') return (window.location.href = urlParams.get('redirect'));
  } else {
    if (result.message == '로그인 성공') return (window.location.href = '/');
  }

  alert(result.message);
});

class loginData {
  constructor() {
    this.email = userEmail.value;
    this.password = userPassword.value;
  }
}
