const fs            = require("fs"),
	  path          = require("path"),
	  jBD           = require("jbd"),
	  {randomBytes} = require("crypto");

class Store {
	constructor () {
		this.session = {};
		this.timer = {};
	}

	destroy (sid) {
		delete this.session[sid];
		delete this.timer[sid];
	}

	getID (length) {
		return randomBytes(length).toString("hex");
	}

	get (sid) {
		if (!this.session[sid]) return null;

		return JSON.parse(this.session[sid]);
	}

	set (session, {sid = this.getID(24), maxAge} = {}) {
		if (this.session[sid] && this.timer[sid]) {
			if (this.timer[sid]) clearTimeout(this.timer[sid]);
		}

		if (maxAge) {
			this.timer[sid] = setTimeout(() => this.destroy(sid), maxAge);
		}

		try {
			this.session[sid] = JSON.stringify(session);
		}
		catch (e) {
			console.error(`set session error: ${e}`)
		}

		return sid;
	}
}

async function middleware (ctx, next) {
	let {key, store} = opts,
		id           = ctx.cookies.get(key, opts);

	if (!id) ctx.session = {};
	else {
		ctx.session = await store.get(id, ctx);
		if (!jBD.isObject(ctx.session)) ctx.session = {};
	}

	let state = false,
		vold  = JSON.stringify(ctx.session),
		vnew;

	ctx.session.refresh = () => { state = true; };
	await next();

	vnew = JSON.stringify(ctx.session);

	if (!state && vold === vnew) return;
	if (vnew === "{}") ctx.session = null;

	if (id && !ctx.session) {
		await store.destroy(id, ctx);
		ctx.cookies.set(key, null);
	}
	else {
		let sid = await store.set(ctx.session, Object.assign({}, opts, {sid: id}), ctx);
		ctx.cookies.set(key, sid, opts);
	}
}

function Session (opt) {
	opts = opt || {};

	for (let key in defaults) {
		if (opts[key] === undefined) opts[key] = defaults[key];
	}

	return middleware;
}

let defaults = {
		key:   "koa:session",
		store: new Store()
	},
	opts;

Session.Store = Store;

module.exports = exports = Session;
