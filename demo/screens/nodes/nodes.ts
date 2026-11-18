namespace $ {
	export type $airkit_demo_screens_nodes_quota_window = {
		readonly used_percent?: number
		readonly reset_at?: string
	}

	export type $airkit_demo_screens_nodes_quota = {
		readonly rate_limit?: {
			readonly primary_window?: $airkit_demo_screens_nodes_quota_window
			readonly secondary_window?: $airkit_demo_screens_nodes_quota_window
		}
	}

	export type $airkit_demo_screens_nodes_agent = {
		readonly agentId: string
		readonly model: string | null
		readonly sharePercent: number | null
		readonly limitPercent: number | null
		readonly inputTokens: number
		readonly cachedInputTokens: number
		readonly outputTokens: number
		readonly reasoningTokens: number
		readonly requests: number
		readonly maxInputTokens: number
	}

	export type $airkit_demo_screens_nodes_window = {
		readonly resetAt: string
		readonly usedPercent: number
		readonly agents: readonly $airkit_demo_screens_nodes_agent[]
	}

	export type $airkit_demo_screens_nodes_broker = {
		readonly hasToken: boolean
		readonly quota: $airkit_demo_screens_nodes_quota | null
		readonly quotaObservedAt: string | null
		readonly window: $airkit_demo_screens_nodes_window | null
	}

	export type $airkit_demo_screens_nodes_node = {
		readonly name: string
		readonly codexOperatorUrl: string
		readonly codexBroker: $airkit_demo_screens_nodes_broker | null
	}

	function window_agents(node: $airkit_demo_screens_roster_node, elapsed_days: number, used: number): readonly $airkit_demo_screens_nodes_agent[] {
		const spent = $airkit_demo_screens_roster
			.filter(agent => agent.node === node && !agent.archived)
			.map(agent => {
				const days = $airkit_demo_screens_roster_days(agent.id, elapsed_days)
				const sum = (pick: (day: $airkit_demo_screens_roster_day) => number) => days.reduce((total, day) => total + pick(day), 0)

				return { agent, input: sum(day => day.input), cached: sum(day => day.cached), output: sum(day => day.output), messages: sum(day => day.messages_out) }
			})
			.filter(one => one.input > 0)
		const node_input = spent.reduce((total, one) => total + one.input, 0)

		return spent.map(({ agent, input, cached, output, messages }) => ({
			agentId: agent.name,
			model: agent.model,
			sharePercent: used * input / node_input,
			limitPercent: agent.codex_percent,
			inputTokens: input,
			cachedInputTokens: cached,
			outputTokens: output,
			reasoningTokens: Math.round(output * .42),
			requests: Math.round(messages * 1.3),
			maxInputTokens: 96_000 + agent.id * 7_919 % 90_000,
		}))
	}

	export const $airkit_demo_screens_nodes_sample: readonly $airkit_demo_screens_nodes_node[] = [
		{
			name: 'box-1',
			codexOperatorUrl: 'https://codex.example.com/box-1',
			codexBroker: {
				hasToken: true,
				quota: {
					rate_limit: {
						primary_window: { used_percent: 38, reset_at: '1795021200' },
						secondary_window: { used_percent: 71, reset_at: '1795446000' },
					},
				},
				quotaObservedAt: '2026-11-18T13:52',
				window: {
					resetAt: '2026-11-23T15:00',
					usedPercent: 71,
					agents: window_agents('box-1', 5, 71),
				},
			},
		},
		{
			name: 'box-2',
			codexOperatorUrl: 'https://codex.example.com/box-2',
			codexBroker: {
				hasToken: true,
				quota: {
					rate_limit: {
						primary_window: { used_percent: 12, reset_at: '1795018800' },
						secondary_window: { used_percent: 33, reset_at: '1795510800' },
					},
				},
				quotaObservedAt: '2026-11-18T13:40',
				window: {
					resetAt: '2026-11-24T09:00',
					usedPercent: 33,
					agents: window_agents('box-2', 1, 33),
				},
			},
		},
		{
			name: 'box-3',
			codexOperatorUrl: 'https://codex.example.com/box-3',
			codexBroker: {
				hasToken: false,
				quota: null,
				quotaObservedAt: null,
				window: null,
			},
		},
		{
			name: 'box-4',
			codexOperatorUrl: 'https://codex.example.com/box-4',
			codexBroker: null,
		},
	]

	export function $airkit_demo_screens_nodes_find(name: string) {
		const found = $airkit_demo_screens_nodes_sample.find(node => node.name === name)
		if (!found) throw new Error(`Node ${name} is gone`)

		return found
	}

	export type $airkit_demo_screens_nodes_key = 'primary_window' | 'secondary_window'

	const unknown = 'unknown - node did not answer'
	const not_observed = 'not yet observed'

	export function $airkit_demo_screens_nodes_credential(node: $airkit_demo_screens_nodes_node) {
		const broker = node.codexBroker
		if (!broker) return { text: unknown, tone: 'bad' as $airkit_tone }
		if (!broker.hasToken) return { text: 'no credential stored', tone: 'warn' as $airkit_tone }

		return { text: 'connected', tone: 'ok' as $airkit_tone }
	}

	export function $airkit_demo_screens_nodes_quota(node: $airkit_demo_screens_nodes_node, key: $airkit_demo_screens_nodes_key) {
		const window = node.codexBroker?.quota?.rate_limit?.[key]
		const used = typeof window?.used_percent === 'number' ? window.used_percent : null
		const reset = window?.reset_at ? `resets ${window.reset_at}` : ''
		const missing = node.codexBroker ? not_observed : unknown
		const text = used === null ? [missing, reset].filter(Boolean).join(', ') : [`${used}% used`, reset].filter(Boolean).join(', ')

		return { used, reset, missing, text }
	}

	export function $airkit_demo_screens_nodes_agents_text(node: $airkit_demo_screens_nodes_node) {
		if (!node.codexBroker) return unknown
		if (!node.codexBroker.window) return 'quota window not yet observed'

		const agents = node.codexBroker.window.agents
		if (!agents.length) return 'no agent has spent anything in this window'

		return String(agents.length)
	}

	export function $airkit_demo_screens_nodes_observed(node: $airkit_demo_screens_nodes_node) {
		const observed = node.codexBroker?.quotaObservedAt
		if (!observed) return ''

		return new $mol_time_moment(observed).toString('YYYY-MM-DD hh:mm')
	}
}
