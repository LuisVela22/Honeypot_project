import jwt from 'jsonwebtoken';

class AuthController {
    async createAccessToken(payload){
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return token;
    }
}
export default AuthController;

const controller = new AuthController();
export const createAccessToken = controller.createAccessToken.bind(controller);