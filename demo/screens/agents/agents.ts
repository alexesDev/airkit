namespace $ {
	export type $airkit_demo_screens_agents_status = $airkit_demo_screens_roster_status

	export type $airkit_demo_screens_agents_place = 'pod' | 'node'

	export type $airkit_demo_screens_agents_image = {
		readonly name: string
		readonly failed: boolean
		readonly error: string
	}

	export type $airkit_demo_screens_agents_component = {
		readonly name: string
		readonly title: string
		readonly setting: string
		readonly on: boolean
		readonly link: string
		readonly hint: string
		readonly state: string
		readonly place: $airkit_demo_screens_agents_place
		readonly group: string
		readonly images: readonly $airkit_demo_screens_agents_image[]
	}

	export type $airkit_demo_screens_agents_part_state = 'OFF' | 'NOT_PLACED' | 'PENDING' | 'RUNNING' | 'RESTARTING' | 'FAILED' | 'STOPPED' | 'UNREAD'

	export type $airkit_demo_screens_agents_part = {
		readonly name: string
		readonly state: $airkit_demo_screens_agents_part_state
		readonly restarts: number
		readonly event: string
		readonly memory: number | null
		readonly cpu: number | null
	}

	export type $airkit_demo_screens_agents_link = {
		readonly label: string
		readonly url: string
		readonly description: string
	}

	export type $airkit_demo_screens_agents_backup_state = 'queued' | 'running' | 'complete' | 'failed'

	export type $airkit_demo_screens_agents_backup = {
		readonly id: number
		readonly state: $airkit_demo_screens_agents_backup_state
		readonly reason: string
		readonly bytes: number
		readonly error: string
		readonly created: string
		readonly started: string
		readonly finished: string
	}

	export type $airkit_demo_screens_agents_export = {
		readonly id: string
		readonly url: string
		readonly expires: string
		readonly ready_at: number
		readonly expires_at: number
	}

	export type $airkit_demo_screens_agents_detail = {
		readonly last_error: string
		readonly node_id: number
		readonly user_ids: string
		readonly grafana: string
		readonly verdict: string
		readonly prices_unread: string
		readonly reserved_memory: number
		readonly reserved_cpu: number
		readonly reserved_from: 'allocation' | 'job'
		readonly params: Readonly<Record<string, string>>
		readonly components: readonly $airkit_demo_screens_agents_component[]
		readonly parts: readonly $airkit_demo_screens_agents_part[]
		readonly links: readonly $airkit_demo_screens_agents_link[]
		readonly backup_enabled: boolean
		readonly backup_time: string
		readonly backups: readonly $airkit_demo_screens_agents_backup[]
	}

	export type $airkit_demo_screens_agents_agent = $airkit_demo_screens_roster_agent & $airkit_demo_screens_agents_detail

	export function $airkit_demo_screens_agents_tone(status: $airkit_demo_screens_agents_status): $airkit_tone {
		switch (status) {
			case 'RUNNING': return 'ok'
			case 'PENDING': return 'warn'
			case 'STOPPING': return 'warn'
			case 'DOWN': return 'bad'
			case 'UNPLACED': return 'bad'
			default: return 'neutral'
		}
	}

	export function $airkit_demo_screens_agents_should_run(status: $airkit_demo_screens_agents_status) {
		return status === 'RUNNING' || status === 'PENDING' || status === 'UNPLACED' || status === 'DOWN'
	}

	type Switches = Readonly<Record<string, boolean>>

	function image(name: string, broken: string): $airkit_demo_screens_agents_image {
		if (name !== broken) return { name, failed: false, error: '' }

		return { name, failed: true, error: 'manifest unknown: ' + name + ':2026.11.2 not found' }
	}

	function components(host: string, switches: Switches, broken: string): readonly $airkit_demo_screens_agents_component[] {
		const always = (name: string, title: string, group: string, place: $airkit_demo_screens_agents_place, hint: string, link: string, images: readonly string[]): $airkit_demo_screens_agents_component => ({
			name, title, setting: '', on: true, link, hint, state: '', place, group,
			images: images.map(one => image(one, broken)),
		})
		const switched = (setting: string, name: string, title: string, group: string, hint: string, path: string, images: readonly string[]): $airkit_demo_screens_agents_component => ({
			name, title, setting, on: switches[setting] ?? false, link: path && switches[setting] ? host + path : '', hint, state: '', place: 'pod', group,
			images: images.map(one => image(one, broken)),
		})

		return [
			always('hermes', 'Agent', 'agent', 'pod', 'The agent itself: the model loop, its terminal and its memory, with the tasks that prepare its volumes and close its way out.', '', ['hermes']),
			always('knowledge', 'Knowledge base', 'secondbrain', 'pod', 'Everything this agent has written down and been given, as pages a person reads and searches.', host + '/', ['trip2g']),
			always('selfservice', 'Connected accounts and stored keys', 'selfservice', 'pod', "Accounts and keys this agent holds on someone's behalf, never a value.", host + '/_accounts/', ['selfservice']),
			always('tgbotproxy', 'Bot proxy', 'agent', 'pod', 'The Telegram bot this agent answers as, and the chat history it keeps.', '', ['tgbotproxy']),
			switched('TG_ACCOUNT_PROXY', 'tgaccountproxy', 'Telegram account', 'tgaccountproxy', 'Let this agent act as a Telegram account, not only as a bot', '/_account/', ['tgaccountproxy']),
			switched('LEADRADAR', 'leadradar', 'Telegram message index', 'leadradar', 'Give this agent a Telegram message index (leadradar)', '/_leadradar/', ['leadradar']),
			switched('MAILBOX', 'mailbox', 'Mailbox', 'mailbox', 'Give this agent a mailbox (agent-to-agent mail)', '/_mailbox/', ['mailbox']),
			switched('SCRAPEQ', 'scrapeq', 'Data jobs', 'scrapeq', "Pull a service's data into SQLite on a schedule", '/_jobs/', ['scrapeq']),
			switched('CODEX_FLEET_ENABLED', 'codexfleet', 'Codex fleet', 'fleet', 'Run role notes through Codex (fleet)', '', ['fleet']),
			switched('OPENROUTER_API_KEY', 'openrouter', 'OpenRouter', 'openrouter', 'OpenRouter API key', '', ['openrouterproxy']),
			always('codexbroker', 'Codex broker', 'agent', 'node', "The node's own broker: every model call leaves the pod through it, so the agent never holds the Codex credential.", '', []),
			switched('STEEL_BROWSER', 'steel', 'Browser', 'steel', 'Give this agent a real browser (steel)', '', ['steel']),
			switched('DESKTOP', 'desktop', 'Desktop', 'desktop', 'Desktop with Chromium and Telegram', '/_desktop/', ['desktop']),
			switched('HERMES_WEBCHAT', 'webchat', 'Web chat', 'webchat', 'Web chat', '/_chat/', ['webchat']),
		]
	}

	const prices: Readonly<Record<string, readonly [number | null, number | null]>> = {
		hermes: [2048, 1000],
		knowledge: [512, 200],
		selfservice: [64, 50],
		tgbotproxy: [64, 50],
		tgaccountproxy: [128, 50],
		leadradar: [256, 100],
		mailbox: [64, 50],
		scrapeq: [256, 100],
		codexfleet: [128, 50],
		openrouter: [64, 50],
		codexbroker: [null, null],
		steel: [1024, 500],
		desktop: [1536, 500],
		webchat: [128, 50],
	}

	function parts(list: readonly $airkit_demo_screens_agents_component[], state: $airkit_demo_screens_agents_part_state, special: Readonly<Record<string, Partial<$airkit_demo_screens_agents_part>>>): readonly $airkit_demo_screens_agents_part[] {
		return list.map(component => {
			const [memory, cpu] = prices[component.name] ?? [null, null]
			const own: $airkit_demo_screens_agents_part_state = component.place === 'node' ? 'UNREAD' : component.on ? state : 'OFF'

			return { name: component.name, state: own, restarts: 0, event: '', memory, cpu, ...special[component.name] }
		})
	}

	function reserved(list: readonly $airkit_demo_screens_agents_component[]) {
		const on = list.filter(component => component.on)

		return {
			reserved_memory: on.reduce((sum, component) => sum + (prices[component.name]?.[0] ?? 0), 0),
			reserved_cpu: on.reduce((sum, component) => sum + (prices[component.name]?.[1] ?? 0), 0),
		}
	}

	const telegram_list: $airkit_demo_screens_agents_link = {
		label: 'Your agents in Telegram',
		url: 'https://box-1.example.com/miniapp/',
		description: "The list a person opens from the Telegram menu button: every agent they may enter, this one among them. Your /miniapp page's link back to the list points here.",
	}

	const switches: Readonly<Record<number, Switches>> = {
		1: { SCRAPEQ: true, DESKTOP: true, MAILBOX: true, HERMES_WEBCHAT: true },
		2: { TG_ACCOUNT_PROXY: true, LEADRADAR: true },
		3: { CODEX_FLEET_ENABLED: true },
		4: { STEEL_BROWSER: true, SCRAPEQ: true },
		5: { MAILBOX: true },
		6: { SCRAPEQ: true },
		7: { HERMES_WEBCHAT: true, DESKTOP: true },
		8: {},
		9: { SCRAPEQ: true },
		10: { MAILBOX: true },
		11: { SCRAPEQ: true, CODEX_FLEET_ENABLED: true },
	}

	const broken_image: Readonly<Record<number, string>> = { 4: 'steel' }

	function host(agent: $airkit_demo_screens_roster_agent) {
		return 'https://agent-' + agent.name + '.example.com'
	}

	function generic(agent: $airkit_demo_screens_roster_agent): $airkit_demo_screens_agents_detail {
		const list = components(host(agent), switches[agent.id] ?? {}, broken_image[agent.id] ?? '')
		const running = agent.status === 'RUNNING'

		return {
			last_error: '',
			node_id: agent.node === 'box-2' ? 2 : 1,
			user_ids: '1002003' + (agent.id + 10),
			grafana: 'https://grafana.example.com/d/agent?var-agent=' + agent.name,
			verdict: running ? 'Running, all parts up.' : 'Stopped.',
			prices_unread: '',
			...reserved(list),
			reserved_from: running ? 'allocation' : 'job',
			params: { REASONING_EFFORT: 'medium', TIMEZONE: 'Europe/Berlin', CPU_MHZ: '', MEM_MB: '', STORE_DB_LIMIT_MB: '' },
			components: list,
			parts: parts(list, running ? 'RUNNING' : 'STOPPED', {}),
			links: [telegram_list],
			backup_enabled: true,
			backup_time: '03:00',
			backups: [
				{ id: agent.id + 20, state: 'complete', reason: 'scheduled', bytes: 9_400_000 + agent.id * 310_000, error: '', created: '2026-11-18T03:00:0' + agent.id % 10 + 'Z', started: '2026-11-18T03:00:1' + agent.id % 10 + 'Z', finished: '2026-11-18T03:00:4' + agent.id % 10 + 'Z' },
			],
		}
	}

	function special(agent: $airkit_demo_screens_roster_agent): Partial<$airkit_demo_screens_agents_detail> {
		const list = components(host(agent), switches[agent.id] ?? {}, broken_image[agent.id] ?? '')

		switch (agent.id) {
			case 1: return {
				user_ids: '100200301, 100200302',
				params: { REASONING_EFFORT: 'medium', TIMEZONE: 'Europe/Berlin', CPU_MHZ: '', MEM_MB: '4096', STORE_DB_LIMIT_MB: '' },
				parts: parts(list, 'RUNNING', { scrapeq: { restarts: 1 } }),
				links: [
					telegram_list,
					{ label: 'Desktop', url: host(agent) + '/_desktop/', description: 'Chromium, Telegram Desktop, window controls and screen recordings. Sign in here to share an application session with this agent.' },
				],
				backups: [
					{ id: 41, state: 'complete', reason: 'scheduled', bytes: 48_970_000, error: '', created: '2026-11-18T03:00:02Z', started: '2026-11-18T03:00:04Z', finished: '2026-11-18T03:00:51Z' },
					{ id: 38, state: 'complete', reason: 'manual', bytes: 48_120_000, error: '', created: '2026-11-17T16:22:40Z', started: '2026-11-17T16:22:41Z', finished: '2026-11-17T16:23:30Z' },
					{ id: 35, state: 'failed', reason: 'scheduled', bytes: 0, error: 'the agent did not stop within 120 s', created: '2026-11-17T03:00:01Z', started: '2026-11-17T03:00:03Z', finished: '2026-11-17T03:02:03Z' },
				],
			}
			case 2: return {
				user_ids: '100200301',
				params: { REASONING_EFFORT: 'low', TIMEZONE: 'Europe/Moscow', CPU_MHZ: '1500', MEM_MB: '', STORE_DB_LIMIT_MB: '512' },
				backup_enabled: false,
				backups: [
					{ id: 22, state: 'complete', reason: 'manual', bytes: 12_400_000, error: '', created: '2026-11-10T09:41:12Z', started: '2026-11-10T09:41:13Z', finished: '2026-11-10T09:41:38Z' },
				],
			}
			case 3: return {
				node_id: 7,
				user_ids: '',
				grafana: '',
				prices_unread: 'the spec could not be rendered with every switch on',
				params: { REASONING_EFFORT: '', TIMEZONE: '', CPU_MHZ: '', MEM_MB: '', STORE_DB_LIMIT_MB: '' },
				parts: parts(list, 'STOPPED', { leadradar: { memory: null, cpu: null }, desktop: { memory: null, cpu: null } }),
				links: [],
				backup_enabled: false,
				backups: [],
			}
			case 4: return {
				last_error: 'task "steel" failed: Failed to pull `steel:2026.11.2`: manifest unknown',
				user_ids: '100200303',
				verdict: 'Down: task "steel" failed to pull its image. Nomad tries again on its own.',
				reserved_from: 'allocation',
				params: { REASONING_EFFORT: 'high', TIMEZONE: 'UTC', CPU_MHZ: '2000', MEM_MB: '6144', STORE_DB_LIMIT_MB: '1024' },
				parts: parts(list, 'PENDING', { steel: { state: 'FAILED', restarts: 3, event: 'Failed to pull `steel:2026.11.2`: manifest unknown' } }),
				backup_time: '04:30',
				backups: [
					{ id: 40, state: 'complete', reason: 'scheduled', bytes: 7_300_000, error: '', created: '2026-11-17T04:30:01Z', started: '2026-11-17T04:30:02Z', finished: '2026-11-17T04:30:19Z' },
				],
			}
			default: return {}
		}
	}

	function own_reservation(detail: $airkit_demo_screens_agents_detail): $airkit_demo_screens_agents_detail {
		const [memory, cpu] = prices.hermes
		const params = detail.params
		const parts = detail.parts.map(part => part.name === 'hermes' ? { ...part, memory: Number(params.MEM_MB) || memory, cpu: Number(params.CPU_MHZ) || cpu } : part)
		const on = parts.filter(part => detail.components.some(component => component.name === part.name && component.on))

		return {
			...detail,
			parts,
			reserved_memory: on.reduce((sum, part) => sum + (part.memory ?? 0), 0),
			reserved_cpu: on.reduce((sum, part) => sum + (part.cpu ?? 0), 0),
		}
	}

	export const $airkit_demo_screens_agents_sample: readonly $airkit_demo_screens_agents_agent[] = $airkit_demo_screens_roster.map(agent => {
		const detail = own_reservation({ ...generic(agent), ...special(agent) })

		return { ...agent, ...detail, params: { MODEL: agent.model, ...detail.params } }
	})

	const backup_pause = 2500

	function stamp(ms: number) {
		return new Date(ms).toISOString().replace(/\.\d+Z$/, 'Z')
	}

	export class $airkit_demo_screens_agents_store extends $mol_object {
		@$mol_mem
		agents(next?: readonly $airkit_demo_screens_agents_agent[]) {
			return next ?? $airkit_demo_screens_agents_sample
		}

		matches(agent: $airkit_demo_screens_agents_agent, filter: string) {
			const running = $airkit_demo_screens_agents_should_run(agent.status)

			switch (filter) {
				case 'running': return !agent.archived && running
				case 'stopped': return !agent.archived && !running
				case 'archived': return agent.archived
				default: return !agent.archived
			}
		}

		found(query: string) {
			const needle = query.trim().toLowerCase()
			if (!needle) return this.agents()

			return this.agents().filter(agent => (agent.name + ' ' + agent.description).toLowerCase().includes(needle))
		}

		list(filter: string, query: string) {
			return this.found(query).filter(agent => this.matches(agent, filter))
		}

		counts(query: string) {
			const found = this.found(query)
			const running = found.filter(agent => this.matches(agent, 'running')).length
			const stopped = found.filter(agent => this.matches(agent, 'stopped')).length
			const archived = found.filter(agent => this.matches(agent, 'archived')).length

			return { active: running + stopped, running, stopped, archived }
		}

		agent(id: number) {
			const found = this.agents().find(agent => agent.id === id)
			if (!found) throw new Error('Agent not found')

			return found
		}

		change(id: number, patch: (agent: $airkit_demo_screens_agents_agent) => $airkit_demo_screens_agents_agent) {
			this.agents(this.agents().map(agent => agent.id === id ? patch(agent) : agent))
		}

		run_parts(agent: $airkit_demo_screens_agents_agent, state: $airkit_demo_screens_agents_part_state) {
			return agent.parts.map(part => part.state === 'OFF' || part.state === 'UNREAD' ? part : { ...part, state, restarts: 0, event: '' })
		}

		start(id: number) {
			this.$.$mol_wait_timeout(700)
			const agent = this.agent(id)
			if (agent.archived) return 'this agent is archived — unarchive it first'
			if (!agent.bot) return 'the agent has no working bot — pick a free bot in agent editing'

			this.change(id, one => ({ ...one, status: 'RUNNING', verdict: 'Running, all parts up.', last_error: '', parts: this.run_parts(one, 'RUNNING') }))

			return ''
		}

		stop(id: number) {
			this.$.$mol_wait_timeout(700)
			this.change(id, one => ({ ...one, status: 'STOPPED', verdict: 'Stopped.', parts: this.run_parts(one, 'STOPPED') }))

			return ''
		}

		archive(id: number) {
			this.$.$mol_wait_timeout(700)
			const agent = this.agent(id)
			if (agent.archived) return 'this agent is already archived'

			this.change(id, one => ({ ...one, archived: true }))

			return ''
		}

		unarchive(id: number) {
			this.$.$mol_wait_timeout(700)
			const agent = this.agent(id)
			if (!agent.archived) return 'this agent is not archived'

			this.change(id, one => ({ ...one, archived: false, status: 'STOPPED' }))

			return ''
		}

		@$mol_mem_key
		queued_at(id: number, next?: Readonly<Record<number, number>>) {
			return next ?? {}
		}

		backups(id: number): readonly $airkit_demo_screens_agents_backup[] {
			const queued = this.queued_at(id)
			const now = Object.keys(queued).length ? this.$.$mol_state_time.now(500) : 0

			return this.agent(id).backups.map(backup => {
				const at = queued[backup.id]
				if (at === undefined) return backup
				if (now < at + backup_pause) return backup
				if (now < at + 2 * backup_pause) return { ...backup, state: 'running', started: stamp(at + backup_pause) }

				return { ...backup, state: 'complete', bytes: 48_990_000, started: stamp(at + backup_pause), finished: stamp(at + 2 * backup_pause) }
			})
		}

		in_progress(id: number) {
			return this.backups(id).some(backup => backup.state === 'queued' || backup.state === 'running')
		}

		capture(id: number, reason: string) {
			this.$.$mol_wait_timeout(500)
			if (this.in_progress(id)) return { id: 0, refusal: 'a backup of this agent is already in progress' }

			const all = this.agents().flatMap(agent => agent.backups.map(backup => backup.id))
			const next = Math.max(0, ...all) + 1
			const now = Date.now()
			const backup: $airkit_demo_screens_agents_backup = { id: next, state: 'queued', reason, bytes: 0, error: '', created: stamp(now), started: '', finished: '' }

			this.change(id, one => ({ ...one, backups: [backup, ...one.backups] }))
			this.queued_at(id, { ...this.queued_at(id), [next]: now })

			return { id: next, refusal: '' }
		}

		save_schedule(id: number, enabled: boolean, time: string) {
			this.$.$mol_wait_timeout(500)
			if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) return 'backup time must be HH:MM in UTC'

			this.change(id, one => ({ ...one, backup_enabled: enabled, backup_time: time }))

			return ''
		}

		@$mol_mem_key
		export(id: number, next?: $airkit_demo_screens_agents_export | null) {
			return next ?? null
		}

		create_export(id: number, backup: number, ttl: number) {
			let source = backup
			let wait = 1500
			if (!source) {
				const captured = this.capture(id, 'export')
				if (captured.refusal) return captured.refusal
				source = captured.id
				wait += 2 * backup_pause
			} else {
				this.$.$mol_wait_timeout(500)
				const found = this.backups(id).find(one => one.id === source)
				if (!found) return 'backup not found'
				if (found.state !== 'complete') return 'choose a completed backup of this agent'
			}

			const now = Date.now()
			const expires_at = now + ttl * 1000
			const item: $airkit_demo_screens_agents_export = {
				id: 'exp' + source + '-' + now,
				url: 'https://box-1.example.com/exports/agent-' + id + '-backup-' + source + '.tar.gz',
				expires: stamp(expires_at),
				ready_at: now + wait,
				expires_at,
			}
			this.export(id, item)

			return ''
		}

		export_state(id: number) {
			const item = this.export(id)
			if (!item) return ''

			const now = this.$.$mol_state_time.now(1000)
			if (now >= item.expires_at) return 'expired'
			if (now < item.ready_at) return 'running'

			return 'ready'
		}

		restore(id: number, backup: number) {
			this.$.$mol_wait_timeout(700)
			const found = this.backups(id).find(one => one.id === backup)
			if (!found) return 'backup not found'
			if (found.state !== 'complete') return 'only a completed backup can be restored'
			if (this.in_progress(id)) return 'a backup of this agent is in progress; wait for it to finish'

			return ''
		}

		save_limit(id: number, percent: number) {
			this.$.$mol_wait_timeout(500)
			if (percent < 1 || percent > 100) return 'the weekly limit is a percent from 1 to 100'

			this.change(id, one => ({ ...one, codex_percent: percent }))

			return ''
		}
	}
}
