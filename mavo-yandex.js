/*global Mavo, Bliss*/

/**
 * Yandex Disk backend plugin for Mavo.
 * @author Dmitry Sharabin and contributors
 * @version 0.0.1
 */
(function ($) {
"use strict";

Mavo.Plugins.register("yandex", {});

const _ = Mavo.Backend.register(
	class Yandex extends Mavo.Backend {
		id = "Yandex";

		constructor (url, o) {
			super(url, o);

			this.permissions.on(["login", "read"]);

			this.login(true);
		}

		update (url, o) {
			super.update(url, o);

			// Extract info for filepath from URL
			const extension = this.format.constructor.extensions[0] || ".json";

			this.defaults = {
				filepath: "mv-data",
				filename: `${this.mavo.id}${extension}`
			};

			this.info = _.parseURL(this.source, this.defaults);

			// If the author provided backend metadata, use them
			// since they have higher priority
			for (const prop in o) {
				// Skip the format and mavo properties
				// since they are already updated in the parent's update method
				if (["format", "mavo"].includes(prop)) {
					continue;
				}

				this.info[prop] = o[prop];
			}

			$.extend(this, this.info);
		}

		async load () {
			if (this.publicKey) {
				let call = `public/resources/download?public_key=${this.publicKey}`;
				if (this.path) {
					call += `&path=/${this.path}`;
				}

				const resource = await this.request(call);
				const params = new URL(resource.href).searchParams;

				return this.request(resource.href, {}, resource.method, {
					headers: {
						"Content-Type": params.get("content_type")
					}
				});
			}

			if (this.isAuthenticated()) {
				const headers = {
					Authorization: `OAuth ${this.accessToken}`
				};

				const resource = await this.request(`resources/download?path=/${this.path}`, {}, "GET", { headers });
				const params = new URL(resource.href).searchParams;

				return this.request(resource.href, {}, resource.method, { headers: {
					...headers,
					"Content-Type": params.get("content_type")
				} });
			}
		}

		/**
		 * Saves a file to the backend.
		 * @param {string} serialized Serialized data.
		 * @param {string} [path] Optional file path.
		 * @return {Promise} A promise that resolves when the file is saved.
		 */
		async put (serialized, path = this.path) {}

		/**
		 * Upload a file to the backend.
		 * @param {File} file File object to be uploaded.
		 * @param {*} path Relative path to store uploads (e.g., “images”).
		 */
		async upload (file, path) {}

		/**
		 * Authenticate a user.
		 * @param {boolean} passive If it is true, it only checks if the user is already logged in but does not present any login UI.
		 */
		async login (passive) {
			try {
				await this.oAuthenticate(passive);
				await this.getUser();

				if (this.user) {
					this.permissions.on(["edit", "save", "logout"]);
				}
			}
			catch (e) {
				if (e.status === 401) {
					// Unauthorized. Access token we have is invalid, discard it.
					await this.logout();
				}
			}
		}

		async logout () {
			await this.oAuthLogout();
			this.user = null;
		}

		async getUser () {
			if (this.user) {
				return Promise.resolve(this.user);
			}

			const info = await this.request("https://login.yandex.ru/info");
			this.user = {
				username: info.login,
				name: info.display_name,
				avatar: `https://avatars.yandex.net/get-yapic/${info.default_avatar_id}/islands-200`,
				info
			};

			$.fire(this, "mv-login");

			return this.user;
		}

		oAuthParams = () => `&response_type=code`;

		static apiDomain = "https://cloud-api.yandex.net/v1/disk/";
		static oAuth = "https://oauth.yandex.ru/authorize";
		static key = "058fa9986615469dbed89ff6b5983038"; // Client ID

		/**
		 * Parse Yandex Disk URLs.
		 * @param {string} source Resource URL.
		 * @param {object} defaults Default parameters.
		 * @returns filepath, filename, path, public key.
		 */
		static parseURL (source, defaults = {}) {
			const ret = {
				publicKey: undefined
			};

			// Define computed properties as writable accessors
			Object.defineProperties(ret, {
				"path": {
					get () {
						if (this.filename) {
							return (this.filepath? this.filepath + "/" : "") + this.filename;
						}
						else {
							return this.filepath;
						}
					},
					set (v) {
						delete this.path;
						this.path = v;
					},
					configurable: true,
					enumerable: true
				}
			});

			if (!source) {
				return ret;
			}

			const url = new URL(source);

			let path = url.pathname.slice(1).split("/");
			const isPublic = path[0] === "d"; // If true, we have a public file or folder

			// Drop either “client” and “disk” or “d” and “...”
			// We might need them if we have a public file or folder
			const firstTwoSegments = path.splice(0, 2);

			const lastSegment = path.at(-1);

			if (/\.\w+$/.test(lastSegment)) {
				ret.filename = lastSegment;
				path.splice(path.length - 1, 1);
			}
			else {
				ret.filename = !isPublic? defaults.filename : "";
			}

			ret.filepath = path.join("/") || (!isPublic? defaults.filepath : "");

			if (isPublic) {
				ret.publicKey = [url.origin, ...firstTwoSegments].join("/");
			}

			return ret;
		}

		/**
		 * Determines when the backend is used.
		 * @param {string} url The mv-storage/mv-source/mv-init/mv-uploads value.
		 * @returns True if the backend should be used.
		 */
		static test (url) {
			const host = new URL(url).host;
			return /^disk\.yandex\.(com|ru)$/.test(host);
		}
	}
);

Mavo.Locale.register("en", {});
})(Bliss);