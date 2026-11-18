namespace $.$$ {
	export class $airkit_empty extends $.$airkit_empty {
		override parts() {
			return [
				this.Title(),
				...this.text() ? [this.Text()] : [],
				...this.action_title() ? [this.Action()] : [],
			]
		}
	}
}
