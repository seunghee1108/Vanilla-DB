const root = document.getElementById('root');

const inputData = [
  { type: "text", placeholder: "이름", name: "name"},
  { type: "text", placeholder: "ID", name: "username"},
  { type: "password", placeholder: "PW", name: "password"}
];

// form 생성 함수
function createForm(inputData, index) {
  const form = document.createElement('form');

  // 배열을 slice를 이용해 설정한 index로부터 끝 index까지 내용을 복사하여 새로운 배열로 반환해줌
  inputData.slice(index).map(obj => {
    const input = document.createElement('input');
    Object.assign(input, obj);
    form.appendChild(input);
  });

  const submitButton = document.createElement('input');
  submitButton.type = "submit";
  form.appendChild(submitButton);

  // 다 추가하고 완성된 form을 반환
  return form;
}

function xhrRequest(url, formName) {
  // formData를 이용해서 formName에 해당하는 form의 데이터를 수집하고 변수에 할당해줌
  const formData = new FormData(formName);
  // formdata를 서버에 보내기 위해 AJAX 요청 
  // AJAX 요청을 위해 xhr 사용
  const xhr = new XMLHttpRequest();
  // 요청 유형, 주소 설정
  xhr.open("POST", url, true);
  // 요청 헤더 설정
  xhr.setRequestHeader("Content-Type", "application/ x-www-form-urlencoded");

  // xhr의 status 상태에 따른 처리를 설정해줌
  xhr.onreadystatechange = function () {
    // 요청 완료됐는지 확인
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        console.log("서버 응답:", xhr.responseText);
      } else {
        console.log("서버 요청 실패")
      }
    }
  };

  // formdata를 서버로 보내는 부분
  // 쿼리스트링으로 담아 보내줌
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

function joinForm() {
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