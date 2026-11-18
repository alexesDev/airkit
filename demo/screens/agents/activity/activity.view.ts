namespace $.$$ {
	type Bucket = {
		label: string
		dates: readonly string[]
		share: number
	}

	const day_ms = 86_400_000

	const million = 1_000_000

	const hour_profile = Array.from({ length: 24 }, (_, hour) => hour < 7 ? .2 : hour < 20 ? 1 : .5)

	const hour_sum = hour_profile.reduce((total, one) => total + one, 0)

	function shift(date: string, days: number) {
		return new Date(Date.parse(date + 'T00:00:00Z') + days * day_ms).toISOString().slice(0, 10)
	}

	function dotted(date: string) {
		return date.slice(8, 10) + '.' + date.slice(5, 7)
	}

	export class $airkit_demo_screens_agents_activity extends $.$airkit_demo_screens_agents_activity {
		@$mol_mem
		buckets(): readonly Bucket[] {
			const today = $airkit_demo_screens_roster_today

			switch (this.period()) {
				case 'hours': return Array.from({ length: 48 }, (_, index) => {
					const date = shift(today, index < 24 ? -1 : 0)
					const hour = index % 24

					return { label: dotted(date) + ' ' + String(hour).padStart(2, '0') + ':00', dates: [date], share: hour_profile[hour] / hour_sum }
				})
				case 'weeks': return Array.from({ length: 26 }, (_, index) => {
					const start = shift(today, -7 * (25 - index) - 6)

					return { label: dotted(start), dates: Array.from({ length: 7 }, (_, day) => shift(start, day)), share: 1 }
				})
				case 'months': return Array.from({ length: 12 }, (_, index) => {
					const first = new Date(Date.UTC(2026, 10 - 11 + index, 1))
					const length = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate()
					const start = first.toISOString().slice(0, 10)
					const dates = Array.from({ length }, (_, day) => shift(start, day)).filter(date => date <= today)

					return { label: start.slice(5, 7) + '.' + start.slice(0, 4), dates, share: 1 }
				})
				default: return $airkit_demo_screens_roster_days(this.agent_id()).map(day => ({ label: dotted(day.date), dates: [day.date], share: 1 }))
			}
		}

		@$mol_mem
		override labels() {
			return this.buckets().map(bucket => bucket.label)
		}

		sum(pick: (day: $airkit_demo_screens_roster_day) => number) {
			return this.buckets().map(bucket => bucket.share * bucket.dates.reduce((total, date) => total + pick($airkit_demo_screens_roster_activity(this.agent_id(), date)), 0))
		}

		@$mol_mem
		override messages(): readonly $airkit_chart_series[] {
			return [
				{ title: 'From people', values: this.sum(day => day.messages_in) },
				{ title: 'From the agent', values: this.sum(day => day.messages_out) },
			]
		}

		@$mol_mem
		override tokens(): readonly $airkit_chart_series[] {
			return [
				{ title: 'Input, million tokens', values: this.sum(day => day.input / million) },
				{ title: 'Output, million tokens', values: this.sum(day => day.output / million) },
			]
		}

		@$mol_mem
		override cached(): readonly $airkit_chart_series[] {
			return [{ title: 'of it cached', values: this.sum(day => day.cached / million) }]
		}
	}
}
