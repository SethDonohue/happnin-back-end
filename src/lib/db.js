"use strict";

import mongoose from "mongoose";
import { log } from "./util";

const state = {
	isOn: false,
};

export const connect = (testing = false) => {
	log(`___DB_UP___ ${process.env.MONGO_URI}`);
	if (state.isOn || testing) {
		return Promise.reject(new Error("___ERROR___ Already connected to DB"));
	}

	state.isOn = true;
	return mongoose.connect(process.env.MONGO_URI);
};

export const disconnect = () => {
	log("___DB_DOWN___");
	if (!state.isOn) {
		return Promise.reject(new Error("___ERROR___ Not connected to DB"));
	}

	state.isOn = false;
	return mongoose.disconnect();
};
