namespace $.$$ {
	export class $airkit_demo_screens_mailbox extends $.$airkit_demo_screens_mailbox {
		override approvals_waiting() {
			return this.store().pending().length
		}

		override approvals_arg() {
			return this.arg('approvals')
		}

		waiting(spread: string) {
			return spread === 'approvals' ? this.approvals_waiting() : 0
		}

		override menu_link_content(spread: string): readonly $mol_view_content[] {
			if (!this.waiting(spread)) return [this.Menu_link_title(spread)]

			return [this.Menu_link_title(spread), this.Menu_link_count(spread)]
		}

		override menu_link_count(spread: string) {
			return String(this.waiting(spread))
		}
	}
}
