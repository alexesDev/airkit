namespace $.$$ {
	export class $airkit_demo extends $.$airkit_demo {
		override spread_title(id: string) {
			const names: Record<string, string> = this.spread_names()

			return names[id] ?? super.spread_title(id)
		}

		override menu_filter_enabled() {
			return false
		}
	}
}
