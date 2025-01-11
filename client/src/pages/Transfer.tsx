// src/pages/Transfer.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterTransfers, buyPlayer } from "../store/slices/transferSlice";
import { RootState, AppDispatch } from "../store/store";

const Transfer: React.FC = () => {
	const dispatch: AppDispatch = useDispatch();
	const { transfers, loading, error } = useSelector(
		(state: RootState) => state.transfer
	);
	const [filters, setFilters] = useState<{
		teamName?: string;
		playerName?: string;
		price?: number;
	}>({});

	useEffect(() => {
		dispatch(filterTransfers(filters));
	}, [dispatch, filters]);

	const handleBuy = (transferId: string) => {
		dispatch(buyPlayer({ transferId }));
	};

	const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFilters((prev) => ({
			...prev,
			[name]: value ? (name === "price" ? Number(value) : value) : undefined,
		}));
	};

	const handleFilterSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		dispatch(filterTransfers(filters));
	};

	return (
		<div>
			<h1 className="text-3xl font-bold mb-6">Transfer Market</h1>
			<form onSubmit={handleFilterSubmit} className="mb-6">
				<div className="flex space-x-4">
					<input
						type="text"
						name="teamName"
						placeholder="Team Name"
						onChange={handleFilterChange}
						className="border rounded py-2 px-3"
					/>
					<input
						type="text"
						name="playerName"
						placeholder="Player Name"
						onChange={handleFilterChange}
						className="border rounded py-2 px-3"
					/>
					<input
						type="number"
						name="price"
						placeholder="Max Price"
						onChange={handleFilterChange}
						className="border rounded py-2 px-3"
					/>
					<button
						type="submit"
						className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
					>
						Filter
					</button>
				</div>
			</form>
			{loading ? (
				<p>Loading transfers...</p>
			) : error ? (
				<p className="text-red-500">{error}</p>
			) : transfers.length === 0 ? (
				<p>No transfers available.</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{transfers.map((transfer) => (
						<div
							key={transfer._id}
							className="bg-white shadow-md rounded px-8 py-6"
						>
							<h2 className="text-xl font-bold mb-2">{transfer.player.name}</h2>
							<p>
								<strong>Position:</strong> {transfer.player.position}
							</p>
							<p>
								<strong>Price:</strong> ${transfer.askingPrice.toLocaleString()}
							</p>
							<p>
								<strong>Owner:</strong> {transfer.owner.email}
							</p>
							<button
								onClick={() => handleBuy(transfer._id)}
								className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
							>
								Buy
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Transfer;
