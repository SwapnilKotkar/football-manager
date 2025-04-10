// team-service/src/types/express/index.d.ts

import { IUser } from "../../../../auth-service/src/models/User"; // Adjust the path based on your project structure

// declare global {
// 	namespace Express {
// 		interface Request {
// 			user?: {
// 				id: string;
// 				email: string;
// 			};
// 		}
// 	}
// }

// team-service/src/types/express/index.d.ts

declare namespace Express {
	export interface Request {
		user?: {
			id: string;
			email: string;
		};
	}
}
