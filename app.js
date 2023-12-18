const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const mysql = require("mysql2");
const PORT = 3000;

const servFile = {
  html: {
    fileName: "./index.html",
    ContentType: "text/html",
  },
  js: {
    fileName: "./index.js",
    ContentType: "application/javascript",
  },
}

const readFile = (fileType, res) => {
  fs.readFile(servFile[fileType].fileName, "utf-8", (err, data) => {
    if(err) {
      res.writeHead(500);
      res.end("서버에러");
    }
    res.writeHead(200, {"Content-Type": `${servFile[fileType].ContentType}; charset=utf-8`});
    res.end(data);
  });
};

const connectData = () => {
  return mysql.createConnection({
    host:"localhost",
    user:"bang",
    password:"0000",
    database:"test",
    
  });
};

const server = http.createServer((req, res) => {
  if(req.url === "/" && req.method === 'GET') {
    readFile("html", res);
  } else if (req.url === "/index.js" && req.method === "GET") {
    readFile("js", res);
  } else if (req.url === "/login" && req.method === "POST") {
    let body = "";
    // POST로 받은 데이터 chunk로 조각조각 받아서 body에 넣어줌 
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    // chunk 수신 다 받으면 할일 
    req.on("end", () => {
      console.log("Received data:", body);
    

      // 쿼리스트링으로 받았으니 qs 모듈로 파싱해줘야 함
      const formData = qs.parse(body);
      // 데이터베이스 연결 설정
      const connection = connectData();
      connection.connect();
      
      const { username, password } = formData;
      // 사용자 이름, 비밀번호를 콘솔에 출력
      console.log("Username and password:", username, password);

      
      const query =  "SELECT * FROM hi WHERE username = ? AND password = ?";

       
       connection.query(query, [username, password], (err, results) => {
        if (err) {
          console.error("Error logging in:", err);
          res.writeHead(500);
          res.end("로그인에 실패했습니다.");
          return;
        }
        // 반환된 데이터 검색 결과가 있나 없나 검증 후 동작 나눠줌 
        if (results.length > 0) {
          res.writeHead(200);
          res.end("로그인이 완료되었습니다.");
        } else {
          res.writeHead(401);
          res.end("사용자를 찾을 수 없거나 비밀번호가 일치하지 않습니다.");
        }
      });
    });
  } else if (req.url === "/join" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      console.log("Received data:", body);
      const formData = qs.parse(body);
      const { name, username, password } = formData;
      const connection = connectData();
      connection.connect();

      const query = "INSERT INTO hi (name, username, password) VALUES (?, ?, ?)";
      connection.query(query, [name, username, password], (err) => {
        if (err) {
          console.log("Error signing up:", err);
          res.writeHead(500);
          res.end("회원가입에 실패했습니다.");
        return;
        }
        res.writeHead(200);
        res.end("회원가입이 완료되었습니다.");
      });
    });
  } else {
    res.writeHead(404);
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});