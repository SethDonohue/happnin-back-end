"use strict";

export const log = (...args) =>
	(process.env.DEBUG = "true" ? console.log(...args) : undefined);
