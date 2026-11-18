namespace $.$$ {
	type Entry = $airkit_demo_screens_auditlog_entry

	export class $airkit_demo_screens_auditlog extends $.$airkit_demo_screens_auditlog {
		@$mol_mem
		paging() {
			const view = this

			return new (class extends $airkit_demo_paging<Entry> {
				override page_size() {
					return view.page_size()
				}

				override fetch(before: number | null) {
					return view.store().page(this.page_size(), before)
				}
			})()
		}

		entries() {
			return this.paging().items()
		}

		@$mol_mem
		override body(): readonly $mol_view[] {
			const list = [this.Columns(), this.List()]

			return this.paging().has_next() ? [...list, this.More()] : list
		}

		override rows() {
			return this.entries().map((_, index) => this.Row(index))
		}

		entry(index: number) {
			return this.entries()[index]
		}

		override row_created(index: number) {
			return new $mol_time_moment(this.entry(index).createdAt).toString('YYYY-MM-DD hh:mm')
		}

		override row_action(index: number) {
			return this.entry(index).action
		}

		override row_email(index: number) {
			return this.entry(index).email
		}

		override row_detail(index: number) {
			const entry = this.entry(index)

			return [entry.detail, entry.ip].filter(Boolean).join(' - ')
		}

		override more(next?: null) {
			if (next === undefined) return null

			this.paging().more()

			return null
		}
	}
}
