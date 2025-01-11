// shared/src/index.ts
import "./types/express"; // Ensure this path is correct
export { default as errorHandler } from "./middlewares/errorHandler";
export { default as logger } from "./utils/logger";
