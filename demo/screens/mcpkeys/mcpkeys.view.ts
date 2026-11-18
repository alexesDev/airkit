namespace $.$$ {
	export class $airkit_demo_screens_mcpkeys extends $.$airkit_demo_screens_mcpkeys {
		@$mol_mem
		override spreads(): Record<string, $mol_view> {
			const spreads: Record<string, $mol_view> = { add: this.Create_page() }
			for (const key of this.store().keys()) spreads['key' + key.id] = this.Show_page('key' + key.id)

			return spreads
		}

		confirm() {
			return this.$.$mol_state_arg.value('confirm') ?? ''
		}

		@$mol_mem
		override pages() {
			const pages = super.pages()
			const spread = this.spread()
			if (!this.confirm() || !this.spreads()[spread] || spread === 'add') return pages

			return [...pages, this.Confirm_page(spread)]
		}

		override confirm_page_title(id: string) {
			return this.confirm() === 'delete' ? `Delete ${this.row(id).name}` : `Revoke ${this.row(id).name}`
		}

		override confirm_text(id: string) {
			const name = this.row(id).name
			if (this.confirm() === 'delete') return `The key ${name} and its record are removed. It leaves this list for good.`

			return `MCP clients that use ${name} stop working: the key no longer lets them in. It stays in the list as revoked.`
		}

		override confirm_button() {
			return this.confirm() === 'delete' ? 'Delete' : 'Revoke'
		}

		override confirm_done_arg() {
			return this.confirm() === 'delete' ? { mcpkey: null, confirm: null } : { confirm: null }
		}

		override confirm_run(id: string, next?: null) {
			if (next === undefined) return null

			const key_id = this.row_key_id(id)
			if (this.confirm() === 'delete') {
				this.store().delete(key_id)

				return null
			}

			this.store().revoke(key_id)
			this.Show_page(id).message('Revoked')

			return null
		}

		override spread_ids_filtered() {
			return super.spread_ids_filtered().filter(id => id !== 'add')
		}

		override spread_title(id: string) {
			return id === 'add' ? this.Create_page().title() : this.row(id).name
		}

		override total_text() {
			const total = this.store().keys().length

			return total === 1 ? '1 key' : `${total} keys`
		}

		row(id: string) {
			return this.store().key(this.row_key_id(id))
		}

		override row_key_id(id: string) {
			return Number(id.slice('key'.length))
		}

		override row_name(id: string) {
			return this.row(id).name
		}

		override row_owner(id: string) {
			return this.row(id).owner
		}

		override row_status(id: string) {
			return $airkit_demo_screens_mcpkeys_status(this.row(id))
		}

		override row_tone(id: string) {
			return this.row(id).revoked ? 'neutral' : 'ok'
		}

		override row_created(id: string) {
			return this.row(id).created
		}
	}
}
