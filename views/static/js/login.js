const userEmail = document.getElementById('userEmail');
const userPassword = document.getElementById('userPassword');
const loginBtn = document.getElementById('loginBtn');

const url = new URL(window.location);
const urlParams = url.searchParams;

loginBtn.addEventListener('click', async () => {
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
