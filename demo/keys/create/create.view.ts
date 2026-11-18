namespace $.$$ {
	export class $airkit_demo_keys_create extends $.$airkit_demo_keys_create {
		override name_bid() {
			const name = this.name()
			if (!name) return ''

			return /^[a-z0-9-]+$/.test(name) ? '' : 'Lowercase letters, digits and dashes only'
		}

		override submit_enabled() {
			return Boolean(this.name()) && !this.name_bid()
		}

		override submit(next?: null) {
			if (next === undefined) return null

			const id = this.store().create(this.name())
			this.name('')
			this.$.$mol_state_arg.value('key', id)

			return null
		}
	}
}
