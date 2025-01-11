// team-service/src/server.ts
import app from "./app";
import cluster from "cluster";
import os from "os";

const PORT: number = parseInt(process.env.PORT as string, 10) || 5001;

if (cluster.isMaster) {
	const numCPUs: number = os.cpus().length;
	console.log(`Team Service: Master ${process.pid} is running`);

	// Fork workers
	for (let i = 0; i < numCPUs; i++) {
		cluster.fork();
	}

	cluster.on("exit", (worker, code, signal) => {
		console.log(`Team Service: Worker ${worker.process.pid} died`);
		cluster.fork(); // Restart the worker
	});
} else {
	app.listen(PORT, () => {
		console.log(`Team Service: Worker ${process.pid} running on port ${PORT}`);
	});
}
