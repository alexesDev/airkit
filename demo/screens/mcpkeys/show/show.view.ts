namespace $.$$ {
	export class $airkit_demo_screens_mcpkeys_show extends $.$airkit_demo_screens_mcpkeys_show {
		key() {
			return this.store().key(this.mcp_key_id())
		}

		override name() {
			return this.key().name
		}

		override fields() {
			const key = this.key()

			return {
				ID: String(key.id),
				Owner: key.owner,
				Status: $airkit_demo_screens_mcpkeys_status(key),
				'Created At': key.created,
				'Last used': key.used || '-',
				'Revoked At': key.revoked || '-',
			}
		}

		override actions() {
			if (this.key().revoked) return [this.Delete()]

			return [this.Revoke(), this.Delete()]
		}
	}
}
