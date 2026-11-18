namespace $.$$ {
	export class $airkit_demo_keys_show extends $.$airkit_demo_keys_show {
		key() {
			return this.store().key(this.key_id())
		}

		override name() {
			return this.key().name
		}

		override tools_shown() {
			return this.key().status === 'revoked' ? [] : [this.Revoke()]
		}

		override secret() {
			return this.store().secret(this.key_id())
		}

		@$mol_mem
		override secret_stage(next?: $airkit_secret_stage): $airkit_secret_stage {
			if (next === 'gone') this.store().secret(this.key_id(), '')

			return next ?? 'shown'
		}

		override fields() {
			const key = this.key()

			return {
				Status: key.status,
				Owner: key.owner,
				Scope: key.scope,
				Created: key.created,
				'Last used': key.used || '-',
			}
		}

		override uses(): readonly $airkit_feed_entry[] {
			const used = this.key().used
			if (!used) return []

			const [hours, minutes] = used.split(' ')[1].split(':').map(Number)
			const last = hours * 60 + minutes
			const at = (shift: number) => {
				const moment = last - shift

				return String(Math.floor(moment / 60)).padStart(2, '0') + ':' + String(moment % 60).padStart(2, '0')
			}

			return [
				{ time: at(0), who: 'GET /api/projects', what: '200, 41 ms' },
				{ time: at(2), who: 'GET /api/notes', what: '200, 88 ms' },
				{ time: at(47), who: 'GET /api/projects', what: '200, 37 ms' },
			]
		}

		override uses_note() {
			const used = this.key().used

			return used ? 'on ' + used.split(' ')[0] : ''
		}

		override body() {
			return [
				...this.secret() || this.secret_stage() === 'gone' ? [this.Secret()] : [],
				this.Card(),
				this.Uses(),
			]
		}

		override uses_content() {
			return this.uses().length ? [this.Feed()] : [this.Unused()]
		}
	}
}
