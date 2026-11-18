namespace $ {
	export type $airkit_demo_screens_dashboard_bucket = {
		readonly start: string
		readonly messagesIn: number
		readonly messagesOut: number
		readonly inputTokens: number
		readonly outputTokens: number
	}

	export type $airkit_demo_screens_dashboard_series = {
		readonly agentId: number
		readonly name: string
		readonly buckets: readonly $airkit_demo_screens_dashboard_bucket[]
	}

	export type $airkit_demo_screens_dashboard_period = 'hours' | 'days' | 'weeks' | 'months'

	export type $airkit_demo_screens_dashboard_link = {
		readonly label: string
		readonly url: string
		readonly description: string
	}

	export type $airkit_demo_screens_dashboard_check = 'PENDING' | 'PASSED' | 'FAILED'

	export type $airkit_demo_screens_dashboard_image = {
		readonly name: string
		readonly ref: string
		readonly checkEntrypoint: readonly string[]
		readonly checkState: $airkit_demo_screens_dashboard_check
		readonly checkError: string | null
	}

	const day_ms = 86_400_000
	const today = Date.parse($airkit_demo_screens_roster_today + 'T00:00:00Z')

	function iso_day(ms: number) {
		return new Date(ms).toISOString().slice(0, 10)
	}

	function hour_weight(hour: number) {
		return hour < 7 || hour > 21 ? .2 : 1.5 + Math.sin((hour - 7) / 14 * Math.PI)
	}

	const hour_total = Array.from({ length: 24 }, (_, hour) => hour_weight(hour)).reduce((sum, weight) => sum + weight, 0)

	type Span = { start: string, days: readonly string[], part: (agent: $airkit_demo_screens_roster_agent) => number }

	function whole(start: string, days: readonly string[]): Span {
		return { start, days, part: () => 1 }
	}

	function spans(period: $airkit_demo_screens_dashboard_period): readonly Span[] {
		switch (period) {
			case 'hours': {
				const now = today + 14 * 3_600_000

				return Array.from({ length: 48 }, (_, index) => {
					const at = now - (47 - index) * 3_600_000
					const hour = new Date(at).getUTCHours()
					const start = new Date(at).toISOString().slice(0, 16)
					const part = (agent: $airkit_demo_screens_roster_agent) => {
						const last = agent.stopped_at || agent.down_at
						if (last && Date.parse(last) < at) return 0

						return hour_weight(hour) / hour_total
					}

					return { start, days: [iso_day(at)], part }
				})
			}
			case 'days':
				return Array.from({ length: 30 }, (_, index) => {
					const day = iso_day(today - (29 - index) * day_ms)

					return whole(day, [day])
				})
			case 'weeks':
				return Array.from({ length: 26 }, (_, index) => {
					const first = today - ((25 - index) * 7 + 6) * day_ms
					const days = Array.from({ length: 7 }, (_, offset) => iso_day(first + offset * day_ms))

					return whole(days[0], days)
				})
			case 'months':
				return Array.from({ length: 12 }, (_, index) => {
					const month = new Date(Date.UTC(2026, 10 - (11 - index), 1))
					const next = Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 1)
					const end = Math.min(next, today + day_ms)
					const count = Math.round((end - month.getTime()) / day_ms)
					const days = Array.from({ length: count }, (_, offset) => iso_day(month.getTime() + offset * day_ms))

					return whole(days[0], days)
				})
		}
	}

	export function $airkit_demo_screens_dashboard_activity(period: $airkit_demo_screens_dashboard_period): readonly $airkit_demo_screens_dashboard_series[] {
		const chosen = spans(period)

		return $airkit_demo_screens_roster.map(agent => {
			const buckets = chosen.map(span => {
				const part = span.part(agent)
				const days = span.days.map(day => $airkit_demo_screens_roster_activity(agent.id, day))
				const sum = (pick: (day: $airkit_demo_screens_roster_day) => number) => Math.round(days.reduce((total, day) => total + pick(day), 0) * part)

				return {
					start: span.start,
					messagesIn: sum(day => day.messages_in),
					messagesOut: sum(day => day.messages_out),
					inputTokens: sum(day => day.input),
					outputTokens: sum(day => day.output),
				}
			})

			return { agentId: agent.id, name: agent.name, buckets }
		})
	}

	export const $airkit_demo_screens_dashboard_links: readonly $airkit_demo_screens_dashboard_link[] = [
		{ label: 'Grafana', url: 'https://grafana.example.com', description: 'Dashboards of the box: nodes, agents, Codex' },
		{ label: 'Nomad', url: 'https://nomad.example.com', description: 'Jobs and allocations' },
		{ label: 'Status page', url: 'https://status.example.org', description: '' },
	]

	export class $airkit_demo_screens_dashboard_store extends $mol_object {
		@$mol_mem
		started() {
			return Date.now()
		}

		images(): readonly $airkit_demo_screens_dashboard_image[] {
			const elapsed = this.$.$mol_state_time.now(5000) - this.started()
			const pending: $airkit_demo_screens_dashboard_check = elapsed > 12_000 ? 'PASSED' : 'PENDING'

			return [
				{
					name: 'hermes',
					ref: 'registry.example.com/agents/hermes@sha256:4f1c9e0b7a2d6c3e8f51a09b2d7c6e4f3a1b8c9d0e2f4a6b8c7d9e1f0a3b5c7d',
					checkEntrypoint: ['hermes', '--version'],
					checkState: 'PASSED',
					checkError: null,
				},
				{
					name: 'steel-browser',
					ref: 'registry.example.com/sidecars/steel@sha256:9a8b7c6d5e4f30211f2e3d4c5b6a79881a2b3c4d5e6f708192a3b4c5d6e7f809',
					checkEntrypoint: ['node', '-e', 'process.exit(0)'],
					checkState: pending,
					checkError: null,
				},
				{
					name: 'leadradar',
					ref: 'registry.example.com/sidecars/leadradar:2026.11.12',
					checkEntrypoint: ['leadradar', 'check'],
					checkState: 'FAILED',
					checkError: 'pull registry.example.com/sidecars/leadradar:2026.11.12: manifest unknown: manifest tagged by "2026.11.12" is not found',
				},
			]
		}
	}
}
