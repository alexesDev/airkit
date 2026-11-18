namespace $.$$ {
	export class $airkit_kv extends $.$airkit_kv {
		override pairs() {
			return Object.keys(this.fields()).map(key => this.Pair(key))
		}

		override key(key: string) {
			return key
		}

		override field_value(key: string) {
			return this.fields()[key]
		}
	}
}
