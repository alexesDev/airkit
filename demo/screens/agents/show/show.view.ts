namespace $.$$ {
	export class $airkit_demo_screens_agents_show extends $.$airkit_demo_screens_agents_show {
		agent() {
			return this.store().agent(this.agent_id())
		}

		override page_title() {
			const agent = this.agent()

			return agent.bot ? `${agent.name} (@${agent.bot})` : agent.name
		}

		override id_string() {
			return String(this.agent_id())
		}

		should_run() {
			return $airkit_demo_screens_agents_should_run(this.agent().status)
		}

		override toggle_title() {
			return this.should_run() ? 'Stop' : 'Start'
		}

		override tools() {
			const state = this.agent().archived
				? [this.Unarchive()]
				: [this.Toggle(), ...this.should_run() ? [] : [this.Archive()]]

			return [
				this.Sample(),
				this.Edit_link(),
				this.Settings_link(),
				...state,
			]
		}

		@$mol_mem
		override message(next?: string) {
			return next ?? ''
		}

		override toggle(next?: null) {
			if (next === undefined) return null

			if (this.should_run()) {
				const refusal = this.store().stop(this.agent_id())
				this.message(refusal || 'Stop queued')
			} else {
				const refusal = this.store().start(this.agent_id())
				this.message(refusal || 'Start queued')
			}

			return null
		}

		override unarchive(next?: null) {
			if (next === undefined) return null

			const refusal = this.store().unarchive(this.agent_id())
			this.message(refusal || 'Unarchived')

			return null
		}

		override verdict() {
			return this.agent().verdict
		}

		node_label() {
			const agent = this.agent()

			return agent.node || `${agent.node_id} — not in the cluster`
		}

		reserved_label() {
			const agent = this.agent()
			const source = agent.reserved_from === 'allocation' ? 'by the allocation' : 'by the job'

			return `${agent.reserved_memory} MB, ${agent.reserved_cpu} MHz, ${source}`
		}

		override fields() {
			const agent = this.agent()

			return {
				'ID': String(agent.id),
				'Name': agent.name,
				'Status': agent.status,
				'Telegram bot': agent.bot ? '@' + agent.bot : 'no bot',
				'Node': this.node_label(),
				'Reserved': this.reserved_label(),
				'Telegram user ids': agent.user_ids || 'everyone is refused until the Hermes step',
				'Created At': new $mol_time_moment(agent.created_at).toString('YYYY-MM-DD hh:mm'),
			}
		}

		@$mol_mem
		links() {
			const agent = this.agent()
			if (agent.status !== 'RUNNING') return []

			const carried = agent.components.flatMap(component => component.link ? [component.link] : [])

			return agent.links.filter(link => !carried.includes(link.url))
		}

		override link_rows() {
			return this.links().map((_, index) => this.Link_row(index))
		}

		override link_label(index: number) {
			return this.links()[index].label
		}

		override link_uri(index: number) {
			return this.links()[index].url
		}

		override link_description(index: number) {
			return this.links()[index].description
		}

		override last_error() {
			return this.agent().last_error
		}

		override body() {
			return [
				...this.message() ? [this.Status_line()] : [],
				this.Verdict(),
				this.Structure(),
				this.Parts(),
				this.Fields(),
				...this.links().length ? [this.Links()] : [],
				...this.last_error() ? [this.Last_error()] : [],
				this.Activity(),
				this.Backups(),
				this.Codex_limit(),
			]
		}
	}
}
