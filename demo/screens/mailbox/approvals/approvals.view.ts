namespace $.$$ {
	export class $airkit_demo_screens_mailbox_approvals extends $.$airkit_demo_screens_mailbox_approvals {
		@$mol_mem
		override spreads(): Record<string, $mol_view> {
			const spreads: Record<string, $mol_view> = {}
			for (const letter of this.store().letters()) spreads[letter.id] = this.Show_page(letter.id)

			return spreads
		}

		override spread_ids_filtered() {
			return this.store().pending().map(letter => letter.id)
		}

		override spread_title(id: string) {
			return this.store().letter(id).alias
		}

		override row_id(id: string) {
			return id
		}

		override row_from(id: string) {
			return this.store().letter(id).alias
		}

		override row_at(id: string) {
			return this.store().letter(id).received
		}
	}
}
