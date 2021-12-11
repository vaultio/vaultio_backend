import { Request, Response } from "express";
import { User, LoginDetail } from "../model";
import { signJWTToken } from "../util/jwt_utils";
import { comparePassword, hashPassword } from "../util/bcrypt_utils";
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
    await User.create({
      username: username as string,
      password: hashedPassword as string,
      email: email as string,
      recovery_mail: recovery_mail as string,
      date_of_birth: date_of_birth as string,
      access_token: "",
      passwrord_reset_token: "",
    });

    return res.status(200).end();
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
