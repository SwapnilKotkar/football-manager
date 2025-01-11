// team-service/src/types/AuthenticatedRequest.d.ts

import { Request } from "express";

interface AuthenticatedRequest extends Request {
	user: {
		id: string;
		email: string;
	};
}

export default AuthenticatedRequest;
