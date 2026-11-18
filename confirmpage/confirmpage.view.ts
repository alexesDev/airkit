namespace $.$$ {
	export class $airkit_confirmpage extends $.$airkit_confirmpage {
		override confirm(next?: null) {
			if (next === undefined) return null

			try {
				this.run(null)
			} catch (error) {
				if ($mol_promise_like(error)) $mol_fail_hidden(error)

				this.message(error instanceof Error ? error.message : String(error))

				return null
			}

			this.message('')
			this.$.$mol_state_arg.go(this.done_arg())

			return null
		}
	}
}
