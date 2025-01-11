// src/store/slices/teamSlice.ts
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { extractErrorMessage } from "../../utils/errorMessage";

interface Player {
	_id: string;
	name: string;
	position: string;
	price: number;
}

interface Team {
	_id: string;
	user: string;
	budget: number;
	players: Player[];
}

interface TeamState {
	team: Team | null;
	loading: boolean;
	error: string | null;
}

const initialState: TeamState = {
	team: null,
	loading: false,
	error: null,
};

export const createTeam = createAsyncThunk(
	"team/create",
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.post("/api/team/create");
			return response.data;
		} catch (err) {
			return rejectWithValue(extractErrorMessage(err, "Team creation failed"));
		}
	}
);

export const fetchTeam = createAsyncThunk(
	"team/fetch",
	async (_, { rejectWithValue }) => {
		try {
			const response = await axios.get("/api/team/");
			return response.data;
		} catch (err) {
			return rejectWithValue(extractErrorMessage(err, "Failed to fetch team"));
		}
	}
);

const teamSlice = createSlice({
	name: "team",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Create Team
			.addCase(createTeam.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				createTeam.fulfilled,
				(state, action: PayloadAction<{ teamId: string }>) => {
					state.loading = false;
					console.log("action_payload----", action.payload);
				}
			)
			.addCase(createTeam.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			})
			// Fetch Team
			.addCase(fetchTeam.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchTeam.fulfilled,
				(state, action: PayloadAction<{ team: Team }>) => {
					state.loading = false;
					state.team = action.payload.team;
				}
			)
			.addCase(fetchTeam.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
});

export default teamSlice.reducer;
