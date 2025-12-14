import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { PrismaClient } from './generated/prisma/index.js';
import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';



dotenv.config();
const app = express();
const prisma = new PrismaClient();

try {
    await prisma.$connect();
    console.log('Connected to the database successfully.');
} catch (error) {
    console.error('Error connecting to the database:', error);
}


//uso de helmet
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { saveUninitialized: false, sameSite: "strict" }
}));

app.set('view engine', 'ejs');
app.set("views", path.join(process.cwd(), "src/views"));

app.use('/', authRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export{
    app, prisma
};