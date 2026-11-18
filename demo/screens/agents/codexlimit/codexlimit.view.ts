namespace $.$$ {
	export class $airkit_demo_screens_agents_codexlimit extends $.$airkit_demo_screens_agents_codexlimit {
		@$mol_mem
		override percent(next?: number) {
			return next ?? this.store().agent(this.agent_id()).codex_percent
		}

		@$mol_mem
		override message(next?: string) {
			return next ?? ''
		}

		override save(next?: null) {
			if (next === undefined) return null

			const percent = this.percent()
			if (!Number.isInteger(percent)) {
				this.message('The weekly limit is a whole percent from 1 to 100.')
				return null
			}

			const refusal = this.store().save_limit(this.agent_id(), percent)
			this.message(refusal || 'Limit saved: ' + this.store().agent(this.agent_id()).codex_percent + '% of the weekly window.')

			return null
		}

		override content() {
			return [
				this.Note(),
				...this.message() ? [this.Message()] : [],
				this.Limit(),
			]
		}
	}
}
