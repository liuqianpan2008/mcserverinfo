const express = require("express");
const app = express();
/*为app添加中间件处理跨域请求*/
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
const options = {
  timeout: 1000 * 5,
  enableSRV: true,
};
// get方式监听
app.get("/mc/java", (req, res) => {
  const data = req.query;
  const util = require("minecraft-server-util");
  if (data.port == null || data.port == "") {
    data.port = util.parseAddress(data.host).port;
  }
  util
    .status(data.host, parseInt(data.port), options)
    .then((result) => {
      res.send({
        cod: 200,
        msg: "查询成功！",
        data: result,
      });
    })
    .catch((error) => {
      res.send({
        cod: 500,
        msg: "查询失败！",
        data: error,
      });
    });
});

app.get("/mc/Bedrock", (req, res) => {
  const data = req.query;
  const util = require("minecraft-server-util");
  util
    .statusBedrock(data.host, parseInt(data.port), options)
    .then((result) => {
      res.send({
        cod: 200,
        msg: "查询成功！",
        data: result,
      });
    })
    .catch((error) => {
      res.send({
        cod: 500,
        msg: "查询失败！",
        data: error,
      });
    });
});

app.get("/mc/query", (req, res) => {
  const data = req.query;
  const util = require("minecraft-server-util");
  if (data.port == null || data.port == "") {
    data.port = util.parseAddress(data.host).port;
  }
  util
    .queryFull(data.host, parseInt(data.port), options)
    .then((result) => {
      res.send({
        cod: 200,
        msg: "查询成功！",
        data: result,
      });
    })
    .catch((error) => {
      res.send({
        cod: 500,
        msg: "查询失败！",
        data: error,
      });
    });
});

// 启动服务器
app.listen(3300, () => {
  console.log("服务器运行在3300");
});
