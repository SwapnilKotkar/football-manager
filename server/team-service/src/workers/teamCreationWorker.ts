// team-service/src/workers/teamCreationWorker.ts
import { Worker } from "worker_threads";
import path from "path";

const createTeam = (userId: string): Promise<string> => {
	return new Promise((resolve, reject) => {
		const worker = new Worker(path.resolve(__dirname, "teamCreationChild.js"), {
			workerData: { userId },
		});

		worker.on(
			"message",
			(message: { status: string; teamId?: string; error?: string }) => {
				if (message.status === "success") {
					resolve(message.teamId as string);
				} else {
					reject(new Error(message.error));
				}
			}
		);

		worker.on("error", (error) => {
			reject(error);
		});

		worker.on("exit", (code) => {
			if (code !== 0) {
				reject(new Error(`Worker stopped with exit code ${code}`));
			}
		});
	});
};

export default createTeam;
