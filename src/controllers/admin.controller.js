import bcrypt from 'bcrypt';
import { prisma } from '../app.js';
import { createAccessToken } from './auth.controller.js';

class AdminController {

    async register(req, res) {
        const { email, password } = req.body;

        try {
            //verificar si el email ya esta registrado
            const userExists = await prisma.user.findUnique({
                where: { email }
            });

            if (userExists) {
                return res.status(400).json({ error: "Email already registered" });
            }

            //hashear password
            const hashedPassword = await bcrypt.hash(password, 10);

            //crear el usuario
            const newUserSaved = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword
                }
            });

            //en el payload no  pasamos datos sensibles
            //solo algo que identifique al usuario
            const token = createAccessToken({ id: newUserSaved.id });

            res
                .cookie("access_token", token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                })
                .status(201)
                .redirect("/login");
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    async login(req, res) {
        try {
            const { email, password } = req.body;

            //encontrar al user por su email
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return res.status(400).json({ error: "Email not registered" });
            }

            //verificar si la contraseña es valida
            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                return res.status(400).json({ error: "Invalid password" });
            }

            //crear el token
            //no pasamos la contaseña en el payload
            const token = createAccessToken({
                id: user.id,
                email: user.email,
                role: user.role
            });

            //guardarmos token en cookiex
            res.cookie("token", token, { httpOnly: true });
            req.session.user = {
                id: user.id,
                email: user.email,
                role: user.role
            };

            return res.redirect(user.role === "admin" ? "admin/admin" : "admin/user");

        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }


    async logout(req, res) {
        try {
            //limpiar la cookie
            res.cookie("access_token", "", {
                expires: new Date(0),
                httpOnly: true,
            })
            console.log("cookie limpiada correctamente");
            return res
                .redirect("/login");

        } catch (error) {
            return res.status(500).json({ error: 'Failed to logout user' });

        }
    }

    async seeAllUsers(req, res) {
        try {
            //obtener todos los usuarios
            const users = await prisma.user.findMany();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


}

export default AdminController;

const controller = new AdminController();
export const register = controller.register.bind(controller);
export const login = controller.login.bind(controller);
export const logout = controller.logout.bind(controller);
export const seeAllUsers = controller.seeAllUsers.bind(controller); 