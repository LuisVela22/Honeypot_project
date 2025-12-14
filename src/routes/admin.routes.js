import { Router } from 'express';
import { prisma } from '../app.js';

const router = Router();

//RUTAS DE PRUEBA
// router.get('/index', (req, res) => {
//     res.send('Admin Dashboard');
// });

// router.get('/settings', (req, res) => {
//     res.send('Admin Settings');
// });


router.get("/admin", async (req, res) => {
    try {
        if (!req.session.user) {
            console.log("NO HAY SESIÓN, REDIRIGIENDO");
            return res.redirect("/login");
        }

        const users = await prisma.user.findMany();

        res.render("admin", {
            user: req.session.user,
            users: users
        });

    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/user", (req, res) => {
    console.log("SESSION ACTUAL:", req.session);
    if (!req.session.user) {
        console.log("NO HAY SESION, REDIRIGIENDO");
        return res.redirect("/login");
    }

    res.render("user", {
        user: req.session.user
    });
});

export default router;