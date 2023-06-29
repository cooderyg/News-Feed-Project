const userEmail = document.getElementById('userEmail');
const userName = document.getElementById('userName');
const userPassword = document.getElementById('userPassword');
const userConfirmPassword = document.getElementById('userConfirmPassword');
const signUpBtn = document.getElementById('signUpBtn');

signUpBtn.addEventListener('click', async () => {
  const api = await fetch('./api/users/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(new signupData()),
  });

  const result = await api.json();
  alert(result.message);

  if (result.message == '회원가입이 완료되었습니다.') return (window.location.href = './login');
});

class signupData {
  constructor() {
    this.email = userEmail.value;
    this.name = userName.value;
    this.password = userPassword.value;
    this.confirmPassword = userConfirmPassword.value;
  }
}
