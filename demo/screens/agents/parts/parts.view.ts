namespace $.$$ {
	const state_words: Record<$airkit_demo_screens_agents_part_state, string> = {
		OFF: 'off',
		NOT_PLACED: 'not placed',
		PENDING: 'pending',
		RUNNING: 'running',
		RESTARTING: 'restarting',
		FAILED: 'failed',
		STOPPED: 'stopped',
		UNREAD: 'not read',
	}

	const state_tones: Record<$airkit_demo_screens_agents_part_state, $airkit_tone> = {
		OFF: 'neutral',
		NOT_PLACED: 'bad',
		PENDING: 'warn',
		RUNNING: 'ok',
		RESTARTING: 'warn',
		FAILED: 'bad',
		STOPPED: 'neutral',
		UNREAD: 'neutral',
	}

	export class $airkit_demo_screens_agents_parts extends $.$airkit_demo_screens_agents_parts {
		agent() {
			return this.store().agent(this.agent_id())
		}

		component(name: string) {
			const found = this.agent().components.find(component => component.name === name)
			if (!found) throw new Error('Unknown part ' + name)

			return found
		}

		part(name: string) {
			const found = this.agent().parts.find(part => part.name === name)
			if (!found) throw new Error('No runtime for part ' + name)

			return found
		}

		override rows() {
			return this.agent().components.map(component => this.Row(component.name))
		}

		override id_string() {
			return String(this.agent_id())
		}

		override part_title(name: string) {
			return this.component(name).title
		}

		override part_internal(name: string) {
			return this.component(name).name
		}

		override state_content(name: string) {
			return this.part_detail(name) ? [this.State_pill(name), this.State_detail(name)] : [this.State_pill(name)]
		}

		override part_state(name: string) {
			return state_words[this.part(name).state]
		}

		override part_tone(name: string) {
			return state_tones[this.part(name).state]
		}

		override part_detail(name: string) {
			const part = this.part(name)
			const restarts = part.restarts ? (part.state === 'RUNNING' ? `restarted ${part.restarts}×` : `${part.restarts}×`) : ''

			return [restarts, part.event].filter(Boolean).join(' · ')
		}

		override part_where(name: string) {
			return this.component(name).place === 'node' ? 'node' : 'pod'
		}

		override part_reserved(name: string) {
			const part = this.part(name)
			const on = this.component(name).on

			if (part.memory === null) return on || !this.agent().prices_unread ? '–' : 'not computed'

			const cost = part.cpu === null ? `${part.memory} MB` : `${part.memory} MB, ${part.cpu} MHz`

			return on ? cost : `+${cost} if on`
		}

		override open_content(name: string) {
			if (!this.component(name).link) return []

			return this.agent().status === 'RUNNING' ? [this.Open_link(name)] : [this.Open_later(name)]
		}

		override part_uri(name: string) {
			return this.component(name).link
		}

		override part_group(name: string) {
			return this.component(name).group
		}

		override part_settings_title(name: string) {
			return this.component(name).on ? 'Settings' : 'Turn on'
		}
	}
}
