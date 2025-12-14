import { Router } from 'express';
import { honeypotProtection } from '../middlewares/honeypotProtection.js';
import { login, register, logout, seeAllUsers } from '../controllers/admin.controller.js';

const router = Router();

//RUTAS DE PRUEBA
// router.get('/index', (req, res) => {
//     res.send('Admin Dashboard');
// });

// router.get('/settings', (req, res) => {
//     res.send('Admin Settings');
// });

//renderizado de vistas
router.get("/login", (req, res) => {
    res.render("login");
});
router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/admin", (req, res) => {
    res.render("admin");
});

//antes de pasar a los servicios, pasa por el middleware que detecta honeypots
router.post("/login", honeypotProtection, login);
router.post("/register", honeypotProtection, register);
router.post("/logout", logout);


export default router;