namespace $.$$ {
	export class $airkit_runs extends $.$airkit_runs {
		override ticks() {
			return this.runs().map((_, index) => this.Tick(index))
		}

		override tick_state(index: number) {
			return this.runs()[index]
		}

		override summary() {
			const runs = this.runs().filter(state => state !== 'none')
			const failed = runs.filter(state => state === 'bad').length

			return `${failed} of the last ${runs.length} runs failed`
		}
	}
}
