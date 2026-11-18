namespace $.$$ {
	export class $airkit_demo_shell extends $.$airkit_demo_shell {
		@$mol_mem
		override density(next?: string) {
			return this.$.$mol_state_arg.value('density', next) ?? 'comfortable'
		}

		@$mol_mem
		override brand(next?: string) {
			return this.$.$mol_state_arg.value('brand', next) ?? this.brand_default()
		}

		@$mol_mem
		settle() {
			const end = () => {
				const node = this.dom_node() as HTMLElement
				node.scroll({ left: node.scrollWidth, behavior: 'smooth' })
			}

			return new this.$.$mol_after_timeout(800, end)
		}

		override auto() {
			this.settle()

			return super.auto()
		}
	}
}
