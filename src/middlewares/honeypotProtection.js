
export function honeypotProtection(req, res, next) {
    if (req.body.hiddenField && req.body.hiddenField.trim() !== '') {
        console.log("Bot detectado - campo honeypot lleno");
        return res.status(403).json({ error: "Accesso bloqueado por actividad sospechosa" });
    }
    next();
}