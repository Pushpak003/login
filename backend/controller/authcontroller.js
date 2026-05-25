const pool = require("../db/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UAParser = require("ua-parser-js");
const crypto = require("crypto");

const sendBlockMail = require("../utils/mailer");

const register = async (req, res) => {
  try {

    const { email, password } = req.body;

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO users(email, password)
      VALUES($1, $2)
      `,
      [email, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const validUser = user.rows[0];

    if (validUser.is_blocked) {

      const resetToken =
        crypto.randomBytes(32).toString("hex");

      const expiry = new Date(
        Date.now() + 15 * 60 * 1000
      );

      await pool.query(
        `
        UPDATE users
        SET
          reset_token = $1,
          reset_token_expiry = $2
        WHERE id = $3
        `,
        [
          resetToken,
          expiry,
          validUser.id
        ]
      );

      const resetLink =
        `http://127.0.0.1:5500/reset.html?token=${resetToken}`;

      try {

        await sendBlockMail(
          validUser.email,
          resetLink
        );

      } catch (mailError) {

        console.log(mailError.message);

      }

      return res.status(403).json({
        message:
          "Account blocked. Reset mail sent again."
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      validUser.password
    );

    if (!isMatch) {

      await pool.query(
        `
        UPDATE users
        SET failed_attempts = failed_attempts + 1
        WHERE id = $1
        `,
        [validUser.id]
      );

      const updatedUser = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [validUser.id]
      );

      const attempts =
        updatedUser.rows[0].failed_attempts;

      if (attempts >= 3) {

        const resetToken =
          crypto.randomBytes(32).toString("hex");

        const expiry = new Date(
          Date.now() + 15 * 60 * 1000
        );

        await pool.query(
          `
          UPDATE users
          SET
            is_blocked = TRUE,
            reset_token = $1,
            reset_token_expiry = $2
          WHERE id = $3
          `,
          [
            resetToken,
            expiry,
            validUser.id
          ]
        );

        const resetLink =
          `http://127.0.0.1:5500/reset.html?token=${resetToken}`;

        try {

          await sendBlockMail(
            validUser.email,
            resetLink
          );

        } catch (mailError) {

          console.log(mailError.message);

        }

        return res.status(403).json({
          message:
            "Account blocked. Reset mail sent."
        });
      }

      return res.status(400).json({
        message:
          `Invalid credentials. Attempts left: ${3 - attempts}`
      });
    }

    await pool.query(
      `
      UPDATE users
      SET failed_attempts = 0
      WHERE id = $1
      `,
      [validUser.id]
    );

    const token = jwt.sign(
      { id: validUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const ip =
      req.headers["x-forwarded-for"] ||
      req.socket.remoteAddress;

    const parser = new UAParser(
      req.headers["user-agent"]
    );

    const browser =
      parser.getBrowser().name;

    const os =
      parser.getOS().name;

    await pool.query(
      `
      INSERT INTO login_history
      (user_id, ip_address, browser, os)
      VALUES($1, $2, $3, $4)
      `,
      [
        validUser.id,
        ip,
        browser,
        os
      ]
    );

    res.status(200).json({
      message: "Login successful",
      token
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const resetPassword = async (req, res) => {
  try {

    const { token, password } = req.body;

    const user = await pool.query(
      `
      SELECT * FROM users
      WHERE reset_token = $1
      `,
      [token]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid token"
      });
    }

    const validUser = user.rows[0];

    if (
      new Date(validUser.reset_token_expiry)
      < new Date()
    ) {
      return res.status(400).json({
        message: "Token expired"
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    await pool.query(
      `
      UPDATE users
      SET
        password = $1,
        is_blocked = FALSE,
        failed_attempts = 0,
        reset_token = NULL,
        reset_token_expiry = NULL
      WHERE id = $2
      `,
      [
        hashedPassword,
        validUser.id
      ]
    );

    res.status(200).json({
      message: "Password reset successful"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  register,
  login,
  resetPassword
};