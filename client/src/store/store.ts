// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import teamReducer from "./slices/teamSlice";
import transferReducer from "./slices/transferSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		team: teamReducer,
		transfer: transferReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
