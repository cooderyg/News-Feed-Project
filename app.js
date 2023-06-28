const express = require("express");
const router = require("./routes/index.route.js");
const viewRouter = require("./views/router");
const app = express();
const PORT = 3000;
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/views/static"));

app.use("/", viewRouter);

app.use("/api", router);

app.listen(PORT, () => {
  console.log(PORT, "포트 번호로 서버가 실행되었습니다.");
});
