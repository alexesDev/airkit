namespace $.$$ {
	export class $airkit_chips extends $.$airkit_chips {
		override option_count(id: string) {
			const count = this.counts()[id]

			return count === undefined ? '' : String(count)
		}
	}
}
