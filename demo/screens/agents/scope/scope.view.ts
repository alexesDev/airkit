namespace $.$$ {
	export class $airkit_demo_screens_agents_scope extends $.$airkit_demo_screens_agents_scope {
		agent_name(arg: string) {
			const id = Number(this.$.$mol_state_arg.value(arg) ?? 0)
			const agent = this.store().agents().find(one => one.id === id)
			if (!agent) return 'agent ' + id

			return agent.bot ? '@' + agent.bot : 'agent ' + agent.id
		}

		override page_title() {
			switch (this.form()) {
				case 'add': return 'Create agent'
				case 'apply': return 'Apply'
				case 'edit': return 'Edit ' + this.agent_name('edit')
				default: return 'Settings of ' + this.agent_name('settings')
			}
		}

		override out_text() {
			switch (this.form()) {
				case 'add': return 'The real panel opens its create form here. This demo rebuilds the agents list and the agent page only, so the form is out of its scope.'
				case 'apply': return 'The real panel pushes every agent to Nomad from here and shows how many jobs changed. This demo has no Nomad behind it, so the page is out of its scope.'
				case 'edit': return "The real panel opens the agent's edit form here. This demo rebuilds the agents list and the agent page only, so the form is out of its scope."
				default: return "The real panel opens the agent's settings, grouped by part, here. This demo rebuilds the agents list and the agent page only, so the form is out of its scope."
			}
		}
	}
}
