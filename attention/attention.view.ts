namespace $.$$ {
	export class $airkit_attention extends $.$airkit_attention {
		override items() {
			return this.entries().map((_, index) => this.Item(index))
		}

		entry(index: number) {
			return this.entries()[index]
		}

		override item_arg(index: number) {
			return this.entry(index).arg
		}

		override item_tone(index: number) {
			return this.entry(index).tone
		}

		override item_count(index: number) {
			return String(this.entry(index).count)
		}

		override item_what(index: number) {
			return this.entry(index).what
		}

		override item_why(index: number) {
			return this.entry(index).why
		}

		override item_action(index: number) {
			return this.entry(index).action
		}
	}
}
