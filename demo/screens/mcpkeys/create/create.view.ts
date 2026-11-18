namespace $.$$ {
	export class $airkit_demo_screens_mcpkeys_create extends $.$airkit_demo_screens_mcpkeys_create {
		@$mol_mem
		override message(next?: string): string {
			return next ?? ''
		}

		@$mol_mem
		refusal(next?: $airkit_demo_screens_mcpkeys_field_error | null): $airkit_demo_screens_mcpkeys_field_error | null {
			return next ?? null
		}

		@$mol_mem
		issued(next?: $airkit_demo_screens_mcpkeys_issued | null): $airkit_demo_screens_mcpkeys_issued | null {
			return next ?? null
		}

		override name_bid() {
			const refusal = this.refusal()

			return refusal?.field === 'name' ? refusal.message : ''
		}

		override secret() {
			return this.issued()?.key ?? ''
		}

		override secret_parts() {
			const secret = this.Secret()
			if (secret.stage() === 'copied') return [secret.Head(), secret.Row(), secret.Note()]

			return [secret.Head(), secret.Row()]
		}

		override open_arg() {
			return { mcpkey: 'key' + this.issued()?.id }
		}

		override form_rows() {
			if (this.issued()) return [this.Secret(), this.Open()]

			return [
				this.Name_field(),
				...this.message() ? [this.Status()] : [],
			]
		}

		override actions() {
			return [this.issued() ? this.Again() : this.Create()]
		}

		override again(next?: null) {
			if (next === undefined) return null

			this.issued(null)
			this.refusal(null)
			this.message('')
			this.Secret().stage('shown')

			return null
		}

		override create(next?: null) {
			if (next === undefined) return null

			this.refusal(null)
			this.issued(null)

			try {
				this.issued(this.store().create(this.name()))
			} catch (error) {
				if ($mol_promise_like(error)) $mol_fail_hidden(error)
				if (!(error instanceof $airkit_demo_screens_mcpkeys_refusal)) throw error

				this.refusal({ field: error.field, message: error.message })

				return null
			}

			this.name('')
			this.message('')
			this.Secret().stage('shown')

			return null
		}
	}
}
