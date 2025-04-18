// shared/src/utils/logger.ts
import { createLogger, format, transports } from "winston";

const logger = createLogger({
	level: "info",
	format: format.combine(format.timestamp(), format.json()),
	transports: [
		new transports.Console(),
		// Add more transports like File if needed
	],
});

export default logger;
