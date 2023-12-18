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

const connetData = () => {
  return mysql.createConnection({
    host:"bangseunghuiui-MacBookAir.local",
    user:"mysql",
    password:"1108",
    database:"TEST",
    port:3308,
  });
};

const server = http.createServer((req, res) => {
  if(req.url === "/" && req.method === 'GET') {
    readFile("html", res);
  } else if (req.url === "/index.js" && req.method === "GET") {
    readFile("js", res);
  } else if (req.url === "/login" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      console.log("Received data:", body);
    

      const formData = qs.parse(body);

      const { username, password } = formData;
      console.log("Username and password:", username, password);

      const query =  "SELECT * FROM users WHERE username = ? AND password = ?";

       connection.query(query, [username, password], (err, results) => {
        if (err) {
          console.error("Error logging in:", err);
          res.writeHead(500);
          res.end("로그인에 실패했습니다.");
          return;
        }
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

      const query = "INSERT INTO users (name, username, password) VALUES (?, ?, ?)";
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