// src/store/slices/transferSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { extractErrorMessage } from "../../utils/errorMessage";

interface Transfer {
	_id: string;
	player: {
		_id: string;
		name: string;
		position: string;
		price: number;
	};
	owner: {
		_id: string;
		email: string;
	};
	askingPrice: number;
	isListed: boolean;
}

interface TransferState {
	transfers: Transfer[];
	loading: boolean;
	error: string | null;
}

const initialState: TransferState = {
	transfers: [],
	loading: false,
	error: null,
};

export const filterTransfers = createAsyncThunk(
	"transfer/filter",
	async (
		filters: { teamName?: string; playerName?: string; price?: number },
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.get("/api/transfer/filter", {
				params: filters,
			});
			return response.data;
		} catch (err) {
			return rejectWithValue(
				extractErrorMessage(err, "Filtering transfers failed")
			);
		}
	}
);

export const listTransfer = createAsyncThunk(
	"transfer/list",
	async (
		data: { playerId: string; askingPrice: number },
		{ rejectWithValue }
	) => {
		try {
			const response = await axios.post("/api/transfer/list", data);
			return response.data;
		} catch (err) {
			return rejectWithValue(
				extractErrorMessage(err, "Listing transfer failed")
			);
		}
	}
);

export const delistTransfer = createAsyncThunk(
	"transfer/delist",
	async (data: { playerId: string }, { rejectWithValue }) => {
		try {
			const response = await axios.post("/api/transfer/delist", data);
			return response.data;
		} catch (err) {
			return rejectWithValue(
				extractErrorMessage(err, "Delisting transfer failed")
			);
		}
	}
);

export const buyPlayer = createAsyncThunk(
	"transfer/buy",
	async (data: { transferId: string }, { rejectWithValue }) => {
		try {
			const response = await axios.post("/api/transfer/buy", data);
			return response.data;
		} catch (err) {
			return rejectWithValue(extractErrorMessage(err, "Buying player failed"));
		}
	}
);

const transferSlice = createSlice({
	name: "transfer",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Filter Transfers
			.addCase(filterTransfers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				filterTransfers.fulfilled,
				(state, action: PayloadAction<{ transfers: Transfer[] }>) => {
					state.loading = false;
					state.transfers = action.payload.transfers;
				}
			)
			.addCase(filterTransfers.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// List Transfer
			.addCase(listTransfer.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				listTransfer.fulfilled,
				(state, action: PayloadAction<{ message: string }>) => {
					state.loading = false;
					console.log("action_payload----", action.payload);
				}
			)
			.addCase(listTransfer.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// Delist Transfer
			.addCase(delistTransfer.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				delistTransfer.fulfilled,
				(state, action: PayloadAction<{ message: string }>) => {
					state.loading = false;
					console.log("action_payload----", action.payload);
				}
			)
			.addCase(delistTransfer.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// Buy Player
			.addCase(buyPlayer.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				buyPlayer.fulfilled,
				(state, action: PayloadAction<{ message: string }>) => {
					state.loading = false;
					console.log("action_payload----", action.payload);
				}
			)
			.addCase(buyPlayer.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export default transferSlice.reducer;
