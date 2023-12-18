const root = document.getElementById('root');

const inputData = [
  { type: "text", placeholder: "이름", name: "name"},
  { type: "text", placeholder: "ID", name: "username"},
  { type: "password", placeholder: "PW", name: "password"}
];

function createForm(inputData, index) {
  const form = document.createElement('form');

  inputData.slice(index).map(obj => {
    const input = document.createElement('input');
    Object.assign(input, obj);
    form.appendChild(input);
  });

  const submitButton = document.createElement('input');
  submitButton.type = "submit";
  form.appendChild(submitButton);

  return form;
}

function xhrRequest(url, formName) {
  const formData = new FormData(formName);
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/ x-www-form-urlencoded");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log("서버 응답:", xhr.responseText);
      } else {
        console.log("서버 요청 실패")
      }
    }
  };

  xhr.send(new URLSearchParams(formData));
}

function loginForm() {
  const loginFrom = createForm(inputData, 1);

  const joinButton = document.createElement("button");
  joinButton.textContent = "회원가입";
  joinButton.addEventListener("click", (e) => {
    e.preventDefault();
    root.innerHTML = "";
    joinForm();
  });

  root.appendChild(joinButton);
  root.appendChild(loginFrom);

  loginFrom.addEventListener("submit", (e) => {
    e.preventDefault();
    xhrRequest("/login", loginFrom);
  });
}

function joinRorm() {
  const joinFrom = createForm(inputData, 0);

  const joinButton = document.createElement("button");
  joinButton.textContent = "로그인페이지";
  joinButton.addEventListener("click", (e) => {
    e.preventDefault();
    root.innerHTML = "";
    loginForm();
  });

  root.appendChild(joinButton);
  root.appendChild(joinFrom);

  joinFrom.addEventListener("submit", (e) => {
    e.preventDefault();
    xhrRequest("/join", joinFrom)
  });
}

loginForm();