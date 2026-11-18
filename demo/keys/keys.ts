namespace $ {
	export type $airkit_demo_keys_status = 'active' | 'expiring' | 'revoked'

	export type $airkit_demo_keys_key = {
		readonly id: string
		readonly name: string
		readonly owner: string
		readonly status: $airkit_demo_keys_status
		readonly created: string
		readonly used: string
		readonly scope: string
	}

	export function $airkit_demo_keys_tone(status: $airkit_demo_keys_status): $airkit_tone {
		switch (status) {
			case 'active': return 'ok'
			case 'expiring': return 'warn'
			default: return 'neutral'
		}
	}

	export class $airkit_demo_keys_store extends $mol_object {
		@$mol_mem
		keys(next?: readonly $airkit_demo_keys_key[]) {
			return next ?? [
				{ id: 'key1', name: 'claude-desktop', owner: 'admin@example.com', status: 'active', created: '2026-11-02 09:12', used: '2026-11-18 13:40', scope: 'read, write' },
				{ id: 'key2', name: 'ci-smoke', owner: 'admin@example.com', status: 'expiring', created: '2026-08-21 17:03', used: '2026-11-17 02:00', scope: 'read' },
				{ id: 'key3', name: 'notebook', owner: 'anna@example.com', status: 'expiring', created: '2026-08-25 11:40', used: '', scope: 'read' },
				{ id: 'key4', name: 'old-laptop', owner: 'anna@example.com', status: 'revoked', created: '2026-03-02 18:11', used: '2026-10-02 18:11', scope: 'read, write' },
			] as const
		}

		key(id: string) {
			const found = this.keys().find(key => key.id === id)
			if (!found) throw new Error(`Key ${id} is gone`)

			return found
		}

		@$mol_mem_key
		secret(id: string, next?: string) {
			return next ?? ''
		}

		create(name: string) {
			this.$.$mol_wait_timeout(600)

			const id = 'key' + (this.keys().length + 1)
			const key: $airkit_demo_keys_key = { id, name, owner: 'admin@example.com', status: 'active', created: '2026-11-18 14:05', used: '', scope: 'read' }
			const secret = 'sk_sample_' + Array.from({ length: 24 }, (_, index) => ((index * 7 + name.length * 13) % 16).toString(16)).join('')

			this.keys([key, ...this.keys()])
			this.secret(id, secret)

			return id
		}

		revoke(id: string) {
			this.$.$mol_wait_timeout(900)

			this.keys(this.keys().map(key => key.id === id ? { ...key, status: 'revoked' as const } : key))
		}
	}
}
