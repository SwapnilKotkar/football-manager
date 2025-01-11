// auth-service/src/utils/emailEmitter.ts
import { EventEmitter } from "events";
import { IUser } from "../models/User";

interface PlayerPurchasedEvent {
	buyerId: string;
	sellerId: string;
	playerId: string;
}

class EmailEmitter extends EventEmitter {
	constructor() {
		super();
		this.on("userRegistered", this.sendWelcomeEmail);
		this.on("passwordReset", this.sendPasswordResetEmail);
		this.on("playerPurchased", this.sendPlayerPurchasedEmail);
	}

	private sendWelcomeEmail(user: IUser) {
		// Integrate with an email service like SendGrid or Nodemailer
		console.log(`Sending welcome email to ${user.email}`);
		// TODO: Implement actual email sending logic
	}

	private sendPasswordResetEmail(user: IUser) {
		console.log(`Sending password reset email to ${user.email}`);
		// TODO: Implement actual email sending logic
	}

	private sendPlayerPurchasedEmail(event: PlayerPurchasedEvent) {
		console.log(
			`Sending purchase confirmation emails for player ${event.playerId} from seller ${event.sellerId} to buyer ${event.buyerId}`
		);
		// TODO: Implement actual email sending logic
	}
}

export default new EmailEmitter();
