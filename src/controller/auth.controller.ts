import { Request, Response } from "express";
import { User, LoginDetail, Password } from "../model";
import { signJWTToken } from "../util/jwt_utils";
import { comparePassword, hashPassword } from "../util/bcrypt_utils";
import {
  generatePasscodes,
  encrypt,
  decrypt,
  isValidPasscode,
} from "../util/encryption_utils";
import { Op } from "sequelize";
export const signin = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (user) {
      if (!(await comparePassword(password, user.password))) {
        return res.status(401).send("Invalid Password").end();
      }

      const access_token = signJWTToken({ user_id: user.id }, 86400000);
      user.access_token = access_token;
      user.save();
      await LoginDetail.create({
        id: 0,
        ip: req.ip,
        email: user.username,
        logged_at: new Date(),
        access_token: access_token,
      });
      res.status(200).json({ access_token }).end();
      return;
    } else {
      return res.status(401).send("Invalid Username/Password").end();
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message ?? "" })
      .end();
  }
};

export const signup = async (req: Request, res: Response) => {
  const { username, password, email, recovery_mail, date_of_birth } = req.body;

  if (
    [username, password, email, recovery_mail, date_of_birth].includes(
      undefined
    )
  )
    return res.status(400).json({ error: "Missing fields" }).end();

  try {
    const user = await User.findOne({
      where: { username, email, date_of_birth },
    });

    if (user !== null) {
      return res.status(400).json({ error: "User already exists" }).end();
    }
    const hashedPassword = await hashPassword(password);
    const { passCodes, encryptedPasswords } = generatePasscodes(password);
    await User.create({
      username: username as string,
      password: hashedPassword as string,
      email: email as string,
      recovery_mail: recovery_mail as string,
      date_of_birth: date_of_birth as string,
      access_token: "",
      encrypted_password: encryptedPasswords.join(";"),
    });

    return res.status(200).json({ passcodes: passCodes }).end();
  } catch (error: any) {
    return res.status(500).json({ error: error.message }).end();
  }
};

export const showSignup = async (req: Request, res: Response) => {
  if (
    process.env.MULTI_USER_SUPPORTED &&
    Boolean(process.env.MULTI_USER_SUPPORTED) === true
  )
    return res
      .status(200)
      .json({
        show_signup: true,
      })
      .end();

  if ((await User.findAll()).length > 0)
    return res
      .json({
        show_signup: false,
      })
      .end();

  return res
    .json({
      show_signup: false,
    })
    .end();
};

export const resetPassword = async (req: Request, res: Response) => {
  const passcode = req.body.passcode;
  const newPassword = req.body.password;
  const username = req.body.username;
  const user = await User.findOne({
    where: { [Op.or]: [{ username }, { email: username }] },
  });

  if (!user) return res.status(400).json({ error: "No user found" }).end();
  if (
    isValidPasscode(passcode, user.password, user.encrypted_password.split(";"))
  ) {
    const oldPassword = user.password;
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    const { passCodes, encryptedPasswords } = generatePasscodes(newPassword);
    user.encrypted_password = encryptedPasswords.join(";");
    user.save();
    const passwordsByUser = await Password.findAll({
      where: { owner_id: user.id },
    });
    if (passwordsByUser.length > 0) {
      for (let i = 0; i < passwordsByUser.length; i++) {
        passwordsByUser[i].password = encrypt(
          decrypt(passwordsByUser[i].password, oldPassword),
          user.password
        );
        passwordsByUser[i].save();
      }
    }
    return res
      .status(200)
      .json({ message: "Password changed", passcodes: passCodes })
      .end();
  }

  return res.status(400).json({ error: "Invalid passcode" }).end();
};
