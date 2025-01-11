// auth-service/src/controllers/authController.ts
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import BlacklistedToken from "../models/BlacklistedToken";
import {
	generateAccessToken,
	generateRefreshToken,
} from "../services/tokenService";
import emailEmitter from "../utils/emailEmitter";

export const register = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const { email, password } = req.body;
	try {
		const existing = await User.findOne({ email });
		if (existing)
			return res.status(400).json({ message: "Email already exists" });

		const hashed = await bcrypt.hash(password, 10);
		const user: IUser = new User({ email, password: hashed });
		await user.save();

		// Emit event for sending welcome email
		emailEmitter.emit("userRegistered", user);

		return res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		console.error("Auth Service: Register Error", error);
		return res.status(500).json({ message: "Server error" });
	}
};

export const login = async (req: Request, res: Response): Promise<Response> => {
	const { email, password } = req.body;
	try {
		const user: IUser | null = await User.findOne({ email });
		if (!user) return res.status(400).json({ message: "Invalid credentials" });

		const match: boolean = await bcrypt.compare(password, user.password);
		if (!match) return res.status(400).json({ message: "Invalid credentials" });

		const accessToken: string = generateAccessToken(user);
		const refreshToken: string = generateRefreshToken();

		user.refreshTokens.push({ token: refreshToken });
		await user.save();

		return res.json({ accessToken, refreshToken });
	} catch (error) {
		console.error("Auth Service: Login Error", error);
		return res.status(500).json({ message: "Server error" });
	}
};

export const refreshTokenHandler = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const { refreshToken } = req.body;
	if (!refreshToken)
		return res.status(401).json({ message: "No refresh token provided" });

	try {
		const user: IUser | null = await User.findOne({
			"refreshTokens.token": refreshToken,
		});
		if (!user)
			return res.status(403).json({ message: "Invalid refresh token" });

		// Optionally, verify if refresh token is blacklisted

		// Generate new tokens
		const newAccessToken: string = generateAccessToken(user);
		const newRefreshToken: string = generateRefreshToken();

		// Replace old refresh token
		user.refreshTokens = user.refreshTokens.filter(
			(t) => t.token !== refreshToken
		);
		user.refreshTokens.push({ token: newRefreshToken });
		await user.save();

		return res.json({
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		});
	} catch (error) {
		console.error("Auth Service: Refresh Token Error", error);
		return res.status(500).json({ message: "Server error" });
	}
};

export const logout = async (
	req: Request,
	res: Response
): Promise<Response> => {
	const { refreshToken } = req.body;
	if (!refreshToken)
		return res.status(400).json({ message: "No refresh token provided" });

	try {
		const user: IUser | null = await User.findOne({
			"refreshTokens.token": refreshToken,
		});
		if (!user)
			return res.status(403).json({ message: "Invalid refresh token" });

		// Remove the refresh token
		user.refreshTokens = user.refreshTokens.filter(
			(t) => t.token !== refreshToken
		);
		await user.save();

		// Blacklist the refresh token
		const decoded: any = jwt.decode(refreshToken);
		const expiresAt: Date = decoded
			? new Date(decoded.exp * 1000)
			: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
		const blacklisted = new BlacklistedToken({
			token: refreshToken,
			expiresAt,
		});
		await blacklisted.save();

		return res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.error("Auth Service: Logout Error", error);
		return res.status(500).json({ message: "Server error" });
	}
};

// Middleware to verify token and check blacklist
export const verifyToken = async (
	req: Request,
	res: Response,
	next: Function
): Promise<void> => {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		res.status(401).json({ message: "No token provided" });
		return;
	}

	const token = authHeader.split(" ")[1];
	if (!token) {
		res.status(401).json({ message: "No token provided" });
		return;
	}

	try {
		const blacklisted = await BlacklistedToken.findOne({ token });
		if (blacklisted) {
			res.status(401).json({ message: "Token has been revoked" });
			return;
		}

		const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
		req.user = { id: decoded.id, email: decoded.email };
		next();
	} catch (error) {
		console.error("Auth Service: Verify Token Error", error);
		res.status(401).json({ message: "Invalid token" });
	}
};
