// dependencias de primer nivel o npms
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// modulos desarrollados por el producto
import { db } from "../data/connection.js";
import { JWT_SECRET } from "../keys/keys.js";

// $1, $2, $3
// [param1, param2, param3]

// [param1 = $1, param2 = $2, param3 = $3]

export const SingIn = async (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    async (error, results) => {
      if (error) {
        throw error;
      }

      const resultFind = results.rows;
      if (resultFind.length < 1)
        return res.status(400).json({ message: "Invalid user find" });

      const userFind = resultFind[0]; // Este const hace referencia al usuario que se encontró con ese email

      const isPasswordValid = await bcrypt.compare(password, userFind.password); // false si no es cierto | true si las constraseñas coinciden
      if (!isPasswordValid)
        return res.status(400).json({ message: "Invalid credentials" });

      const _jwt = jwt.sign({ id: userFind.id }, JWT_SECRET, {
        expiresIn: "8h",
      });

      return res
        .status(200)
        .json({ success: true, message: "user finded", _jwt, userFind });
    }
  );
};