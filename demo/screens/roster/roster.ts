namespace $ {
	export type $airkit_demo_screens_roster_status = 'DOWN' | 'PENDING' | 'RUNNING' | 'STOPPED' | 'STOPPING' | 'UNPLACED'

	export type $airkit_demo_screens_roster_node = '' | 'box-1' | 'box-2'

	export type $airkit_demo_screens_roster_rate = {
		readonly input: number
		readonly cached: number
		readonly output: number
		readonly messages_in: number
		readonly messages_out: number
	}

	export type $airkit_demo_screens_roster_entry = {
		readonly id: number
		readonly name: string
		readonly description: string
		readonly status: $airkit_demo_screens_roster_status
		readonly archived: boolean
		readonly bot: string
		readonly node: $airkit_demo_screens_roster_node
		readonly model: string
		readonly codex_percent: number
		readonly created_at: string
		readonly stopped_at: string
		readonly down_at: string
		readonly rate: $airkit_demo_screens_roster_rate
	}

	export type $airkit_demo_screens_roster_agent = $airkit_demo_screens_roster_entry & {
		readonly input_tokens_30d: number
		readonly cached_tokens_30d: number
		readonly output_tokens_30d: number
		readonly messages_in_30d: number
		readonly messages_out_30d: number
	}

	export type $airkit_demo_screens_roster_day = {
		readonly date: string
		readonly input: number
		readonly cached: number
		readonly output: number
		readonly messages_in: number
		readonly messages_out: number
	}

	export const $airkit_demo_screens_roster_today = '2026-11-18'

	const entries: readonly $airkit_demo_screens_roster_entry[] = [
		{ id: 1, name: 'sales-desk', description: 'Answers site leads and books calls', status: 'RUNNING', archived: false, bot: 'sales_desk_bot', node: 'box-1', model: 'gpt-5.5', codex_percent: 40, created_at: '2026-03-02T10:14:00Z', stopped_at: '', down_at: '', rate: { input: 4_420_000, cached: 3_320_000, output: 123_000, messages_in: 125, messages_out: 152 } },
		{ id: 2, name: 'support-ru', description: 'Support for Russian-speaking customers', status: 'STOPPED', archived: false, bot: 'support_ru_bot', node: 'box-1', model: 'gpt-5.4', codex_percent: 25, created_at: '2026-03-14T08:03:00Z', stopped_at: '2026-11-12T17:40:00Z', down_at: '', rate: { input: 1_660_000, cached: 1_170_000, output: 50_000, messages_in: 52, messages_out: 61 } },
		{ id: 3, name: 'kb-keeper', description: 'Kept the team handbook', status: 'STOPPED', archived: true, bot: '', node: '', model: 'gpt-5.4', codex_percent: 50, created_at: '2026-04-20T12:00:00Z', stopped_at: '2026-09-30T18:00:00Z', down_at: '', rate: { input: 900_000, cached: 640_000, output: 26_000, messages_in: 20, messages_out: 24 } },
		{ id: 4, name: 'research-desk', description: 'Weekly digest of competitor sites', status: 'DOWN', archived: false, bot: 'research_desk_bot', node: 'box-2', model: 'gpt-5.5', codex_percent: 60, created_at: '2026-10-28T15:27:00Z', stopped_at: '', down_at: '2026-11-17T04:31:00Z', rate: { input: 2_100_000, cached: 1_580_000, output: 61_000, messages_in: 47, messages_out: 55 } },
		{ id: 5, name: 'pm-weekly', description: 'Collects project status every Friday', status: 'RUNNING', archived: false, bot: 'pm_weekly_bot', node: 'box-1', model: 'gpt-5.5', codex_percent: 30, created_at: '2026-10-29T09:30:00Z', stopped_at: '', down_at: '', rate: { input: 3_400_000, cached: 2_520_000, output: 98_000, messages_in: 106, messages_out: 127 } },
		{ id: 6, name: 'legal-intake', description: 'Sorts incoming contract requests', status: 'RUNNING', archived: false, bot: 'legal_intake_bot', node: 'box-2', model: 'gpt-5.5', codex_percent: 35, created_at: '2026-10-30T09:30:00Z', stopped_at: '', down_at: '', rate: { input: 2_950_000, cached: 2_070_000, output: 86_000, messages_in: 82, messages_out: 99 } },
		{ id: 7, name: 'content-plan', description: 'Drafts the content calendar', status: 'RUNNING', archived: false, bot: 'content_plan_bot', node: 'box-1', model: 'gpt-5.5', codex_percent: 45, created_at: '2026-10-31T09:30:00Z', stopped_at: '', down_at: '', rate: { input: 5_070_000, cached: 3_690_000, output: 164_000, messages_in: 152, messages_out: 174 } },
		{ id: 8, name: 'hr-screening', description: 'Screens job applications', status: 'STOPPED', archived: false, bot: 'hr_screening_bot', node: 'box-2', model: 'gpt-5.4', codex_percent: 20, created_at: '2026-11-02T09:30:00Z', stopped_at: '2026-11-14T12:10:00Z', down_at: '', rate: { input: 950_000, cached: 660_000, output: 30_000, messages_in: 32, messages_out: 39 } },
		{ id: 9, name: 'finance-notes', description: 'Keeps notes on invoices and payments', status: 'RUNNING', archived: false, bot: 'finance_notes_bot', node: 'box-2', model: 'gpt-5.4', codex_percent: 25, created_at: '2026-11-04T09:30:00Z', stopped_at: '', down_at: '', rate: { input: 1_650_000, cached: 1_190_000, output: 48_000, messages_in: 51, messages_out: 59 } },
		{ id: 10, name: 'onboarding', description: 'Walks new hires through week one', status: 'RUNNING', archived: false, bot: 'onboarding_bot', node: 'box-1', model: 'gpt-5.4', codex_percent: 15, created_at: '2026-11-06T09:30:00Z', stopped_at: '', down_at: '', rate: { input: 1_210_000, cached: 860_000, output: 35_000, messages_in: 41, messages_out: 49 } },
		{ id: 11, name: 'reports', description: 'Builds the monthly management report', status: 'RUNNING', archived: false, bot: 'reports_bot', node: 'box-2', model: 'gpt-5.4', codex_percent: 15, created_at: '2026-11-09T09:30:00Z', stopped_at: '', down_at: '', rate: { input: 960_000, cached: 690_000, output: 28_000, messages_in: 31, messages_out: 35 } },
	]

	const day_ms = 86_400_000

	function day_number(date: string) {
		return Math.floor(Date.parse(date.slice(0, 10) + 'T00:00:00Z') / day_ms)
	}

	function date_of(day: number) {
		return new Date(day * day_ms).toISOString().slice(0, 10)
	}

	function wave(id: number, day: number) {
		const weekday = (day + 4) % 7
		const weekend = weekday === 0 || weekday === 6 ? .45 : 1

		return (.6 + ((day * 37 + id * 11) % 17) / 20) * weekend
	}

	function entry(id: number) {
		const found = entries.find(one => one.id === id)
		if (!found) throw new Error('No agent ' + id + ' in the roster')

		return found
	}

	export function $airkit_demo_screens_roster_last_active(agent: $airkit_demo_screens_roster_entry) {
		return agent.stopped_at || agent.down_at || $airkit_demo_screens_roster_today
	}

	export function $airkit_demo_screens_roster_activity(id: number, date: string): $airkit_demo_screens_roster_day {
		const agent = entry(id)
		const day = day_number(date)
		const active = day >= day_number(agent.created_at) && day <= day_number($airkit_demo_screens_roster_last_active(agent))
		const factor = active ? wave(id, day) : 0
		const rate = agent.rate

		return {
			date: date_of(day),
			input: Math.round(rate.input * factor),
			cached: Math.round(rate.cached * factor),
			output: Math.round(rate.output * factor),
			messages_in: Math.round(rate.messages_in * factor),
			messages_out: Math.round(rate.messages_out * factor),
		}
	}

	export function $airkit_demo_screens_roster_days(id: number, count = 30): readonly $airkit_demo_screens_roster_day[] {
		const last = day_number($airkit_demo_screens_roster_today)

		return Array.from({ length: count }, (_, index) => $airkit_demo_screens_roster_activity(id, date_of(last - count + 1 + index)))
	}

	function totals(agent: $airkit_demo_screens_roster_entry): $airkit_demo_screens_roster_agent {
		const days = $airkit_demo_screens_roster_days(agent.id)
		const sum = (pick: (day: $airkit_demo_screens_roster_day) => number) => days.reduce((total, day) => total + pick(day), 0)

		return {
			...agent,
			input_tokens_30d: sum(day => day.input),
			cached_tokens_30d: sum(day => day.cached),
			output_tokens_30d: sum(day => day.output),
			messages_in_30d: sum(day => day.messages_in),
			messages_out_30d: sum(day => day.messages_out),
		}
	}

	export const $airkit_demo_screens_roster: readonly $airkit_demo_screens_roster_agent[] = entries.map(totals)
}
