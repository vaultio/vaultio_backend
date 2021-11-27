import { Request, Response } from "express";
import { Password, User } from "../model";
import { decrypt, encrypt } from "../util/encryption_utils";
export const addPassword = async (req: Request, res: Response) => {
  try {
    const { access_token, username, password, website, email } = req.body;
    if ([username, password].includes(undefined)) {
      res.status(400).send({ error: "Missing paramters" });
      return;
    }

    const user = await User.findOne({ where: { access_token } });
    if (user) {
      const encryptedPassword = encrypt(password, user.password);
      await Password.create({
        id: 0 as number,
        username: username as string,
        password: encryptedPassword,
        website: website as string,
        email: email as string,
        owner_id: user.id,
      });
      return res.status(200).send("Password added successfully").end();
    } else {
      return res.status(401).send("User not found").end();
    }
  } catch (error) {
    console.log(error);

    return res.status(500).send("Internal Server Error").end();
  }
};

export const getPassword = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { access_token } = req.query;

    if (!id) {
      res.status(400).send({ error: "Missing paramters" });
      return;
    }
    const user = await User.findOne({ where: { access_token } });
    if (user) {
      const password = await Password.findOne({
        where: { owner_id: user.id, id: Number(id) },
      });

      if (password) {
        return res
          .status(200)
          .json({
            ...password.toJSON(),
            password: decrypt(password.password, user.password),
          })
          .end();
      } else {
        return res.status(401).send("Password not found").end();
      }
    } else {
      return res.status(403).send("Unauthorized").end();
    }
  } catch (error) {
    console.log(error);

    return res.status(500).send("Internal Server Error").end();
  }
};

export const getAllPassword = async (req: Request, res: Response) => {
  try {
    const { access_token } = req.query;
    const user = await User.findOne({ where: { access_token } });
    if (user) {
      const passwords = await Password.findAll({
        where: { owner_id: user.id },
      });

      if (passwords && passwords.length > 0) {
        const passwordsWithDecryptedPassword = passwords.map((password) => {
          return {
            ...password.toJSON(),
            password: decrypt(password.password, user.password),
          };
        });
        return res.status(200).json(passwordsWithDecryptedPassword).end();
      } else {
        return res.status(401).send("Password not found").end();
      }
    } else {
      return res.status(403).send("Unauthorized").end();
    }
  } catch (error) {
    console.log(error);

    return res.status(500).send("Internal Server Error").end();
  }
};
