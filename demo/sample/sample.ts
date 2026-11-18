namespace $ {
	export type $airkit_demo_sample_period = '24h' | '7d' | '30d'

	export function $airkit_demo_sample_random(seed: number) {
		let state = seed

		return () => {
			state = (state * 16807) % 2147483647

			return state / 2147483647
		}
	}

	export const $airkit_demo_sample_services = ['api', 'web', 'worker', 'mailer', 'other'] as const

	export function $airkit_demo_sample_points(period: $airkit_demo_sample_period) {
		switch (period) {
			case '24h': return 24
			case '7d': return 7
			default: return 30
		}
	}

	export function $airkit_demo_sample_labels(period: $airkit_demo_sample_period) {
		const count = $airkit_demo_sample_points(period)

		if (period === '24h') {
			return Array.from({ length: count }, (_, hour) => String(hour).padStart(2, '0') + ':00')
		}

		const end = Date.UTC(2026, 10, 18)

		return Array.from({ length: count }, (_, index) => {
			const day = new Date(end - (count - 1 - index) * 86400000)

			return String(day.getUTCDate()).padStart(2, '0') + '.' + String(day.getUTCMonth() + 1).padStart(2, '0')
		})
	}

	export function $airkit_demo_sample_requests(period: $airkit_demo_sample_period): readonly $airkit_chart_series[] {
		const random = $airkit_demo_sample_random(period.length * 7919 + 7)
		const count = $airkit_demo_sample_points(period)
		const scale = period === '24h' ? .08 : 1

		return $airkit_demo_sample_services.map((title, rank) => ({
			title,
			rest: title === 'other',
			values: Array.from({ length: count }, (_, index) => {
				const weekend = period !== '24h' && index % 7 > 4 ? .35 : 1
				const value = (6 - rank) * (.5 + random()) * weekend * (1 + index / 40) * scale

				return Math.round(value * 10) / 10
			}),
		}))
	}

	export function $airkit_demo_sample_totals(period: $airkit_demo_sample_period) {
		const series = $airkit_demo_sample_requests(period)

		return series[0].values.map((_, index) => series.reduce((sum, one) => sum + one.values[index], 0))
	}
}
