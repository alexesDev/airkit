namespace $.$$ {
	export type $airkit_secret_stage = 'shown' | 'copied' | 'gone'

	export class $airkit_secret extends $.$airkit_secret {
		@$mol_mem
		override stage(next?: $airkit_secret_stage): $airkit_secret_stage {
			return next ?? 'shown'
		}

		override parts() {
			if (this.stage() === 'gone') return [this.Gone()]

			return [this.Head(), this.Row(), this.Note(), this.Done()]
		}

		override copy_label() {
			return this.stage() === 'copied' ? this.copied_title() : this.copy_title()
		}

		override note_shown() {
			return this.stage() === 'copied' ? this.copied_text() : this.note_text()
		}

		override copy(next?: null) {
			if (next === undefined) return null

			const clipboard = $mol_wire_sync(this.$.$mol_dom_context.navigator.clipboard)
			clipboard.writeText(this.value())
			this.stage('copied')

			return null
		}

		override done(next?: null) {
			if (next === undefined) return null
			this.stage('gone')

			return null
		}
	}
}
