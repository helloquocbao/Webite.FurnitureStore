const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findOne } = require("../models/userModel");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const user = await Users.findOne({ email });

      if (user)
        return res.status(400).json({ msg: "The email already exists." });

      if (password.length < 6)
        return res
          .status(400)
          .json({ msg: "Password is at least 6 characters long." });

      //Mã Hóa mật khẩu
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = new Users({
        name,
        email,
        password: passwordHash,
      });

      //Lưu vào vào mongodb
      await newUser.save();

      //Tạo jsonwebtoken để xác thực
      const accesstoken = createAccessToken({ id: newUser._id });
      const refreshtoken = createRefreshtoken({ id: newUser._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: '/user/refresh_token',
      });

      res.json({ accesstoken });
      //res.json({ msg: "Register Success!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });
      if (!user) res.status(400).json({ msg: "User does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) res.status(400).json({ msg: "Incorrect password." });

      // nếu login thành công thì tạo accesstoken vaf refresh token
      const accesstoken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshtoken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/user/refresh_token",
      });
      res.json({accesstoken})

    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  logout: async (req,res) =>{
    try {
      res.clearCookie('refreshtoken',{path: '/user/refresh_token'})
      res.json({msg: "Logged out"})
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(400).json({ msg: "Please Login or Register." });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register." });

        const accesstoken = createAccessToken({ id: user.id });

        res.json({ accesstoken });
      });

      // res.json({ rf_token });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  getUser:async(req,res)=>{
    try {
      const user = await Users.findById(req.user.id).select('-password')
      if(!user)  return res.status(400).json({ msg: "User does not exist" });

      res.json(user)
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  }
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshtoken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = userCtrl;
