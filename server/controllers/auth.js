const { authenticator } = require("otplib");
const QRCode = require("qrcode");
let users = {};

const signUp = (req, res) => {
  const email = req.body.email;
  if (users[email] !== undefined) {
    return res.status(400).json({ msg: "가입한 계정입니다." });
  }

  const secret = authenticator.generateSecret(20);
  QRCode.toDataURL(authenticator.keyuri(email, "tess", secret), (err, url) => {
    if (err) {
      throw err;
    }

    users[email] = {
      secret,
      url,
    };
    return res.status(200).json({ msg: "created new", url });
  });
};

const login = (req, res) => {
  const email = req.body.email;
  if (users[email] === undefined) {
    return res.status(400).json({ msg: "user not signed up" });
  }

  return res.status(200).json({ msg: "success", url: users[email].url });
};

const googleOTPAuth = (req, res) => {
  const email = req.body.email;
  const code = req.body.code;

  if (authenticator.check(code, users[email].secret)) {
    return res.status(200).json({ msg: "2차 인증 성공" });
  }

  return res.status(400).json({ msg: "잘못된 OTP 코드입니다." });
};

module.exports = {
  signUp,
  login,
  googleOTPAuth,
};
