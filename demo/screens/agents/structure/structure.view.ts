namespace $.$$ {
	type Side = 'top' | 'right' | 'bottom' | 'left'

	const side_of_group: Record<string, Side> = {
		tgaccountproxy: 'right',
		leadradar: 'right',
		mailbox: 'right',
		scrapeq: 'right',
		fleet: 'bottom',
		openrouter: 'bottom',
		steel: 'left',
		desktop: 'left',
		webchat: 'left',
		agent: 'left',
	}

	const sides: readonly Side[] = ['top', 'left', 'right', 'bottom']

	const params: readonly { name: string, label: string }[] = [
		{ name: 'MODEL', label: 'Model' },
		{ name: 'REASONING_EFFORT', label: 'Reasoning' },
		{ name: 'TIMEZONE', label: 'Timezone' },
		{ name: 'CPU_MHZ', label: 'CPU, MHz' },
		{ name: 'MEM_MB', label: 'Memory, MB' },
		{ name: 'STORE_DB_LIMIT_MB', label: 'Knowledge base, MB' },
	]

	export class $airkit_demo_screens_agents_structure extends $.$airkit_demo_screens_agents_structure {
		agent() {
			return this.store().agent(this.agent_id())
		}

		override agent_name() {
			return this.agent().name
		}

		override agent_status() {
			return this.agent().status
		}

		override agent_tone() {
			return $airkit_demo_screens_agents_tone(this.agent().status)
		}

		override access_line() {
			const ids = this.agent().user_ids

			return ids ? 'Telegram ids allowed in: ' + ids : 'Nobody is allowed in yet'
		}

		override params() {
			const values = this.agent().params
			const fields: Record<string, string> = {}
			for (const param of params) fields[param.label] = values[param.name] || 'image default'

			return fields
		}

		override id_string() {
			return String(this.agent_id())
		}

		grafana_cube(): $airkit_demo_screens_agents_component {
			return {
				name: 'grafana',
				title: 'Grafana',
				setting: '',
				on: true,
				link: this.agent().grafana,
				hint: "This agent's page in the box's Grafana.",
				state: '',
				place: 'node',
				group: '',
				images: [],
			}
		}

		cube(name: string) {
			if (name === 'grafana') return this.grafana_cube()

			const found = this.agent().components.find(component => component.name === name)
			if (!found) throw new Error('Unknown cube ' + name)

			return found
		}

		side(cube: $airkit_demo_screens_agents_component): Side {
			if (cube.place === 'node') return 'bottom'
			if (!cube.setting) return 'top'

			return side_of_group[cube.group] ?? 'right'
		}

		override cubes() {
			const cubes = this.agent().components.filter(cube => cube.name !== 'hermes' && cube.on)
			const placed = sides.flatMap(side => cubes.filter(cube => this.side(cube) === side).map(cube => this.Cube(cube.name)))

			return [...placed, this.Cube('grafana')]
		}

		failed_images(name: string) {
			return this.cube(name).images.filter(image => image.failed)
		}

		override cube_title(name: string) {
			return this.cube(name).title
		}

		override cube_name(name: string) {
			if (name === 'grafana') return ''

			return this.cube(name).name
		}

		override cube_group(name: string) {
			return this.cube(name).group
		}

		override cube_hint(name: string) {
			return this.cube(name).hint
		}

		override cube_broken(name: string) {
			return this.failed_images(name).map(image => `Image ${image.name}: ${image.error || 'check failed'}`).join('. ')
		}

		override cube_state(name: string) {
			const cube = this.cube(name)
			if (name === 'grafana') return 'always on'
			if (this.failed_images(name).length) return 'image did not pull'
			if (cube.state) return cube.state
			if (cube.name === 'tgbotproxy' && this.agent().bot) return '@' + this.agent().bot
			if (cube.place === 'node') return 'on the node'
			if (!cube.setting) return 'always on'

			return cube.on ? 'on' : 'off'
		}

		override cube_tone(name: string): $airkit_tone {
			if (this.failed_images(name).length) return 'bad'
			if (this.cube(name).place === 'node') return 'neutral'

			return this.cube(name).on ? 'ok' : 'neutral'
		}

		override cube_uri(name: string) {
			if (name === 'grafana') return this.agent().grafana
			if (this.agent().status !== 'RUNNING') return ''

			return this.cube(name).link
		}

		override cube_icons(name: string) {
			return [
				...this.cube(name).group ? [this.Cube_settings(name)] : [],
				...this.cube_uri(name) ? [this.Cube_open(name)] : [],
			]
		}

		override cube_sub(name: string) {
			return [
				this.Cube_top(name),
				this.Cube_state(name),
				this.Cube_hint(name),
				...this.cube_broken(name) ? [this.Cube_broken(name)] : [],
			]
		}
	}
}
