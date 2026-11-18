namespace $.$$ {
	const forms = ['add', 'apply', 'edit', 'settings']

	export class $airkit_demo_screens_agents extends $.$airkit_demo_screens_agents {
		@$mol_mem
		override status_filter(next?: string) {
			return this.$.$mol_state_arg.value('agent_status', next) ?? 'active'
		}

		@$mol_mem
		override query(next?: string) {
			return this.$.$mol_state_arg.value('agent_query', next) ?? ''
		}

		@$mol_mem
		override spreads(): Record<string, $mol_view> {
			const spreads: Record<string, $mol_view> = {}
			for (const form of forms) spreads[form] = this.Scope_page(form)
			for (const agent of this.store().agents()) spreads['key' + agent.id] = this.Show_page('key' + agent.id)

			return spreads
		}

		@$mol_mem
		override spread_ids_filtered() {
			return this.store().list(this.status_filter(), this.query()).map(agent => 'key' + agent.id)
		}

		override status_counts() {
			return this.store().counts(this.query())
		}

		override pages() {
			const extra: $mol_view[] = []
			if (this.open_agent() && this.$.$mol_state_arg.value('confirm') === 'archive') extra.push(this.Archive_confirm())
			if (this.open_agent() && this.restore_id()) extra.push(this.Restore_confirm())

			return [...super.pages(), ...extra]
		}

		open_agent() {
			const id = this.$.$mol_state_arg.value('agent') ?? ''
			if (!id.startsWith('key')) return null

			return this.store().agents().find(agent => 'key' + agent.id === id) ?? null
		}

		restore_id() {
			return Number(this.$.$mol_state_arg.value('restore') ?? 0)
		}

		override archive_title() {
			return `Archive ${this.open_agent()?.name}?`
		}

		override archive_text() {
			return `${this.open_agent()?.name} stays stopped and moves from Active to Archived; Unarchive brings it back, stopped.`
		}

		override archive(next?: null) {
			if (next === undefined) return null

			const agent = this.open_agent()
			if (!agent) return null

			const refusal = this.store().archive(agent.id)
			if (refusal) throw new Error(refusal)
			this.Show_page('key' + agent.id).message('Archived')

			return null
		}

		override restore_title() {
			return `Restore #${this.restore_id()}?`
		}

		override restore_text() {
			const agent = this.open_agent()
			const id = this.restore_id()
			const backup = agent ? this.store().backups(agent.id).find(one => one.id === id) : undefined
			const taken = backup ? ` (taken ${new $mol_time_moment(backup.created).toOffset('Z').toString('YYYY-MM-DD hh:mm')} UTC)` : ''

			return `Restoring #${id}${taken} replaces everything this agent knows with that moment.`
		}

		override restore_confirm_title() {
			return `Restore #${this.restore_id()}`
		}

		override restore(next?: null) {
			if (next === undefined) return null

			const agent = this.open_agent()
			if (!agent) return null

			const id = this.restore_id()
			const refusal = this.store().restore(agent.id, id)
			if (refusal) throw new Error(refusal)
			this.Show_page('key' + agent.id).Backups().message('Restore of #' + id + ' queued. The agent stops while it runs and comes back on its own; the audit log records how it ended.')

			return null
		}

		override spread_title(id: string) {
			if (forms.includes(id)) return this.Scope_page(id).title()

			return this.agent(id).name
		}

		override scope_form(id: string) {
			return id
		}

		agent(id: string) {
			return this.store().agent(Number(id.slice(3)))
		}

		override row_id(id: string) {
			return this.agent(id).id
		}

		override row_id_string(id: string) {
			return String(this.agent(id).id)
		}

		override row_name(id: string) {
			return this.agent(id).name
		}

		override row_description(id: string) {
			return this.agent(id).description
		}

		override row_status(id: string) {
			return this.agent(id).status
		}

		override row_tone(id: string) {
			return $airkit_demo_screens_agents_tone(this.agent(id).status)
		}

		override row_bot(id: string) {
			const bot = this.agent(id).bot

			return bot ? '@' + bot : 'no bot'
		}

		override row_created(id: string) {
			return new $mol_time_moment(this.agent(id).created_at).toString('YYYY-MM-DD hh:mm')
		}
	}
}
