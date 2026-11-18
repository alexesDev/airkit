namespace $.$$ {
	export class $airkit_demo_keys extends $.$airkit_demo_keys {
		@$mol_mem
		override spreads(): Record<string, $mol_view> {
			const spreads: Record<string, $mol_view> = { add: this.Create() }
			for (const key of this.store().keys()) spreads[key.id] = this.Show(key.id)

			return spreads
		}

		override spread_ids_filtered() {
			return super.spread_ids_filtered().filter(id => id !== 'add')
		}

		confirming() {
			return this.$.$mol_state_arg.value('key_confirm') === 'revoke'
		}

		@$mol_mem
		override pages() {
			const spread = this.spread()
			const open = spread && spread !== 'add' && this.confirming()

			return open ? [...super.pages(), this.Revoke(spread)] : super.pages()
		}

		override revoke_title(id: string) {
			return 'Revoke ' + this.store().key(id).name
		}

		override revoke_text(id: string) {
			return `Scripts that use ${this.store().key(id).name} stop working at once. A revoked key cannot be turned back on; create a new one instead.`
		}

		override revoke(id: string, next?: null) {
			if (next === undefined) return null
			this.store().revoke(id)

			return null
		}

		override key_id(id: string) {
			return id
		}

		override spread_title(id: string) {
			return id === 'add' ? this.Create().title() : this.store().key(id).name
		}

		override row_name(id: string) {
			return this.store().key(id).name
		}

		override row_status(id: string) {
			return this.store().key(id).status
		}

		override row_tone(id: string) {
			return $airkit_demo_keys_tone(this.store().key(id).status)
		}

		override row_owner(id: string) {
			return this.store().key(id).owner
		}

		override row_used(id: string) {
			return this.store().key(id).used
		}
	}
}
