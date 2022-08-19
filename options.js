const fs = require("fs");
const keys_dir = "./config/"; // 키 파일이 위치
const key = fs.readFileSync(keys_dir + "test0.pem");
const cert = fs.readFileSync(keys_dir + "testp0.pem");

module.exports.options = {
  key,
  cert,
};