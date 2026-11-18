namespace $ {
	export type $airkit_demo_screens_auditlog_entry = {
		readonly id: number
		readonly action: string
		readonly email: string
		readonly detail: string
		readonly ip: string
		readonly createdAt: string
	}

	type Agent = $airkit_demo_screens_agents_agent
	type Event = { action: string, detail: string }

	const admins = [
		{ email: 'admin@example.com', ip: '192.0.2.10' },
		{ email: 'ops@example.com', ip: '192.0.2.34' },
		{ email: 'admin@example.com', ip: '198.51.100.7' },
	]

	const json = (value: object) => JSON.stringify(value)

	function setting(agent: Agent, pick: () => number) {
		const names = Object.keys(agent.params)
		const name = names[Math.floor(pick() * names.length)]

		return { name, value: agent.params[name] || null }
	}

	const events: readonly { weight: number, make: (agent: Agent, pick: () => number) => Event }[] = [
		{ weight: 3, make: (agent, pick) => ({ action: 'mutation:updateAgentSettings', detail: json({ input: { agentId: agent.id, settings: [setting(agent, pick)] } }) }) },
		{ weight: 3, make: agent => ({ action: 'mutation:updateAgentCodexWeeklyLimit', detail: json({ input: { agentId: agent.id, percent: agent.codex_percent } }) }) },
		{ weight: 3, make: agent => ({ action: 'mutation:backupAgent', detail: json({ input: { agentId: agent.id } }) }) },
		{ weight: 2, make: agent => ({ action: 'mutation:updateAgent', detail: json({ input: { agentId: agent.id, name: agent.name, description: agent.description, telegramUserIds: agent.user_ids, whoami: '' } }) }) },
		{ weight: 2, make: agent => ({ action: 'mutation:setAgentSecret', detail: json({ input: { agentId: agent.id, name: 'OPENROUTER_API_KEY', value: '[SENSITIVE]' } }) }) },
		{ weight: 1, make: agent => ({ action: 'mutation:clearAgentSecret', detail: json({ input: { agentId: agent.id, name: 'GOOGLE_SHEETS_KEY' } }) }) },
		{ weight: 1, make: agent => ({ action: 'mutation:exportAgentBackup', detail: json({ input: { agentId: agent.id, backupId: agent.backups[0]?.id ?? null, ttlSeconds: 3600 } }) }) },
		{ weight: 1, make: agent => ({ action: 'mutation:updateAgentBackupSchedule', detail: json({ input: { agentId: agent.id, enabled: agent.backup_enabled, timeUTC: agent.backup_time } }) }) },
	]

	const lifecycle: readonly { at: string, admin: number, action: 'stopAgent' | 'startAgent' | 'archiveAgent', id: number }[] = [
		{ at: '2026-11-11T11:20', admin: 0, action: 'stopAgent', id: 2 },
		{ at: '2026-11-11T11:24', admin: 0, action: 'startAgent', id: 2 },
		{ at: '2026-11-12T17:40', admin: 1, action: 'stopAgent', id: 2 },
		{ at: '2026-11-13T09:05', admin: 0, action: 'archiveAgent', id: 3 },
		{ at: '2026-11-13T10:02', admin: 1, action: 'stopAgent', id: 5 },
		{ at: '2026-11-13T10:06', admin: 1, action: 'startAgent', id: 5 },
		{ at: '2026-11-14T12:10', admin: 2, action: 'stopAgent', id: 8 },
		{ at: '2026-11-15T08:31', admin: 0, action: 'startAgent', id: 4 },
		{ at: '2026-11-16T16:47', admin: 1, action: 'stopAgent', id: 10 },
		{ at: '2026-11-16T16:52', admin: 1, action: 'startAgent', id: 10 },
	]

	const total_weight = events.reduce((sum, event) => sum + event.weight, 0)

	function random(seed: number) {
		let state = seed

		return () => {
			state = (state * 16807) % 2147483647

			return state / 2147483647
		}
	}

	function choose(pick: () => number) {
		let left = pick() * total_weight
		for (const event of events) {
			left -= event.weight
			if (left < 0) return event
		}

		return events[0]
	}

	function history(): readonly Omit<$airkit_demo_screens_auditlog_entry, 'id'>[] {
		const pick = random(4242)
		const agents = $airkit_demo_screens_agents_sample.filter(agent => !agent.archived)
		const start = new $mol_time_moment('2026-11-11T08:40')
		const panel = json({ build: '4c1e9a7', spec: 'hermes', spec_digest: 'sha256:9f2c…e81a', images: { hermes: 'registry.example.com/agents/hermes@sha256:4f1c…5c7d' } })
		const entries: Omit<$airkit_demo_screens_auditlog_entry, 'id'>[] = []
		const push = (at: $mol_time_moment, email: string, ip: string, event: Event) => {
			entries.push({ ...event, email, ip, createdAt: at.toString('YYYY-MM-DDThh:mm') })
		}

		push(start.shift({ minute: -12 }), '', '', { action: 'panel_start', detail: panel })

		for (let day = 0; day < 7; day++) {
			const sessions = 1 + Math.floor(pick() * 3)

			for (let session = 0; session < sessions; session++) {
				const admin = admins[Math.floor(pick() * admins.length)]
				let at = start.shift({ day, hour: session * 3 + Math.floor(pick() * 2), minute: Math.floor(pick() * 50) })

				push(at, admin.email, admin.ip, { action: 'sign_in', detail: '' })

				const steps = 3 + Math.floor(pick() * 6)
				for (let step = 0; step < steps; step++) {
					at = at.shift({ minute: 1 + Math.floor(pick() * 9) })
					const agent = agents[Math.floor(pick() * agents.length)]
					push(at, admin.email, admin.ip, choose(pick).make(agent, pick))
				}

				if (pick() > .5) push(at.shift({ minute: 2 }), admin.email, admin.ip, { action: 'sign_out', detail: '' })
			}
		}

		for (const change of lifecycle) {
			const admin = admins[change.admin]
			const at = new $mol_time_moment(change.at)

			push(at, admin.email, admin.ip, { action: 'mutation:' + change.action, detail: json({ input: { id: change.id } }) })
		}

		push(new $mol_time_moment('2026-11-12T07:15'), 'viewer@example.com', '203.0.113.21', { action: 'denied:mutation:startAgent', detail: json({ input: { id: 4 } }) })
		push(new $mol_time_moment('2026-11-14T08:02'), 'admin@example.com', '192.0.2.10', { action: 'agent_export_download', detail: json({ agentId: 1, backupId: 38, exportId: 'exp_7f3a', status: 200 }) })
		push(new $mol_time_moment('2026-11-15T08:10'), '', '', { action: 'panel_start', detail: panel.replace('4c1e9a7', 'b82d0f3') })
		push(new $mol_time_moment('2026-11-16T10:41'), 'admin@example.com', '192.0.2.10', { action: 'mutation:createTelegramBot', detail: json({ input: { token: '[SENSITIVE]' } }) })

		return entries.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
	}

	export class $airkit_demo_screens_auditlog_store extends $mol_object {
		@$mol_mem
		entries(): readonly $airkit_demo_screens_auditlog_entry[] {
			return history().map((entry, index) => ({ id: index + 1, ...entry })).reverse()
		}

		page(limit: number, before: number | null): $airkit_demo_paging_page<$airkit_demo_screens_auditlog_entry> {
			this.$.$mol_wait_timeout(400)

			const all = this.entries()
			const after = all.filter(entry => before == null || entry.id < before)
			const nodes = after.slice(0, limit)
			const hasNextPage = after.length > limit

			return {
				totalCount: all.length,
				pageInfo: { hasNextPage, endCursor: nodes[nodes.length - 1]?.id ?? null },
				nodes,
			}
		}
	}
}
