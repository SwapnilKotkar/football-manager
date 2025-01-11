// auth-service/src/server.ts
import app from "./app";
import cluster from "cluster";
import os from "os";
import cors from "cors";

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

app.use(
	cors({
		origin: "http://localhost:3000", // Frontend URL
		credentials: true, // Allow cookies
	})
);

if (cluster.isMaster) {
	const numCPUs: number = os.cpus().length;
	console.log(`Auth Service: Master ${process.pid} is running`);

	// Fork workers
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker, code, signal) => {
		console.log(`Auth Service: Worker ${worker.process.pid} died`);
		cluster.fork(); // Restart the worker
	});
} else {
	app.listen(PORT, () => {
		console.log(`Auth Service: Worker ${process.pid} running on port ${PORT}`);
	});
}
