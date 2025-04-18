// shared/src/types/express/index.d.ts
import { IUser } from "../../../auth-service/src/models/User";

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				email: string;
			};
		}
	}
}
