namespace $.$$ {
	export class $airkit_catalog extends $.$airkit_catalog {
		override menu_tools() {
			return [
				...this.actions(),
				this.close_icon(),
			]
		}
	}
}
