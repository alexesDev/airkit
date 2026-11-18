namespace $ {
	export type $airkit_demo_screens_mcpkeys_key = {
		readonly id: number
		readonly name: string
		readonly owner: string
		readonly created: string
		readonly used: string
		readonly revoked: string
	}

	export type $airkit_demo_screens_mcpkeys_issued = {
		readonly id: number
		readonly key: string
	}

	export type $airkit_demo_screens_mcpkeys_field_error = {
		readonly field: string
		readonly message: string
	}

	export function $airkit_demo_screens_mcpkeys_status(key: $airkit_demo_screens_mcpkeys_key) {
		return key.revoked ? 'revoked' : 'active'
	}

	export class $airkit_demo_screens_mcpkeys_store extends $mol_object {
		@$mol_mem
		keys(next?: readonly $airkit_demo_screens_mcpkeys_key[]) {
			return next ?? [
				{ id: 4, name: 'claude-desktop', owner: 'admin@example.com', created: '2026-11-02 09:12', used: '2026-11-18 13:40', revoked: '' },
				{ id: 3, name: 'ci-smoke', owner: 'ops@example.com', created: '2026-10-14 17:03', used: '2026-11-17 02:00', revoked: '' },
				{ id: 2, name: 'notebook', owner: 'admin@example.com', created: '2026-09-25 11:40', used: '', revoked: '' },
				{ id: 1, name: 'old-laptop', owner: 'ops@example.com', created: '2026-03-02 18:11', used: '2026-10-02 18:11', revoked: '2026-10-03 09:20' },
			]
		}

		key(id: number) {
			const found = this.keys().find(key => key.id === id)
			if (!found) throw new Error('Key not found')

			return found
		}

		create(name: string): $airkit_demo_screens_mcpkeys_issued {
			this.$.$mol_wait_timeout(600)

			const trimmed = name.trim()
			if (!trimmed) throw new $airkit_demo_screens_mcpkeys_refusal('name', 'cannot be blank')
			if (trimmed.length > 100) throw new $airkit_demo_screens_mcpkeys_refusal('name', 'the length must be between 1 and 100')

			const id = Math.max(0, ...this.keys().map(key => key.id)) + 1
			const created: $airkit_demo_screens_mcpkeys_key = { id, name: trimmed, owner: 'admin@example.com', created: '2026-11-18 14:05', used: '', revoked: '' }
			const secret = 'mcp_sample' + Array.from({ length: 32 }, (_, index) => 'abcdefghijkLMNOPQRSTuvwxyz012345'[(index * 11 + trimmed.length * 7) % 32]).join('')

			this.keys([created, ...this.keys()])

			return { id, key: secret }
		}

		revoke(id: number) {
			this.$.$mol_wait_timeout(700)

			this.keys(this.keys().map(key => key.id === id ? { ...key, revoked: '2026-11-18 14:06' } : key))
		}

		delete(id: number) {
			this.$.$mol_wait_timeout(700)

			this.keys(this.keys().filter(key => key.id !== id))
		}
	}

	export class $airkit_demo_screens_mcpkeys_refusal extends Error {
		constructor(
			readonly field: string,
			message: string,
		) {
			super(message)
		}
	}
}
