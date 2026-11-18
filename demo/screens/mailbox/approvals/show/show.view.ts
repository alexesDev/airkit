namespace $.$$ {
	export class $airkit_demo_screens_mailbox_approvals_show extends $.$airkit_demo_screens_mailbox_approvals_show {
		letter() {
			return this.store().pending().find(letter => letter.id === this.message_id()) ?? null
		}

		override page_title() {
			const letter = this.letter()
			if (!letter) return 'Resolved'

			return `From ${letter.alias}`
		}

		override meta() {
			const letter = this.letter()

			return {
				Message: this.message_id(),
				From: letter?.alias ?? '',
				Depth: letter ? String(letter.depth) : '',
				Received: letter?.received ?? '-',
			}
		}

		override letter_body() {
			return this.letter()?.body ?? ''
		}

		override actions_enabled() {
			return Boolean(this.letter())
		}

		@$mol_mem
		override message(next?: string) {
			return next ?? ''
		}

		override approve(next?: null) {
			if (next === undefined) return null

			const refusal = this.store().resolve(this.message_id())
			this.message(refusal || 'Approved: the agent sees it now.')

			return null
		}

		override reject(next?: null) {
			if (next === undefined) return null

			const refusal = this.store().resolve(this.message_id())
			this.message(refusal || 'Rejected.')

			return null
		}
	}
}
