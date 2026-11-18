namespace $.$$ {
	export class $airkit_feed extends $.$airkit_feed {
		override items() {
			return this.entries().map((_, index) => this.Item(index))
		}

		override item_time(index: number) {
			return this.entries()[index].time
		}

		override item_who(index: number) {
			return this.entries()[index].who
		}

		override item_tone(index: number) {
			return this.entries()[index].tone ?? 'neutral'
		}

		override line(index: number) {
			const head = this.entries()[index].tone ? this.State(index) : this.Who(index)

			return [head, this.What(index)]
		}

		override item_what(index: number) {
			return this.entries()[index].what
		}
	}
}
