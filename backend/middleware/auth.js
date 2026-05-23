import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) =>
{
    try
    {
        let token;

        if (
            req.headers.authorization && 
            req.headers.authorization.startsWith("Bearer")
        )
        {
            token = req.headers.authorization.split(" ")[1];
        }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if(!user)
            {
                return res.status(401).json({ message: "Unauthorized: User not found" });
            }

            req.user = user;
            next();
    }
    catch (error)
    {
        console.error("Authentication error: ", error);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

