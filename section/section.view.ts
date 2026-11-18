namespace $.$$ {
	export class $airkit_section extends $.$airkit_section {
		override head_parts() {
			return [
				this.Title(),
				...this.note() ? [this.Note()] : [],
				...this.link_title() ? [this.Link()] : [],
			]
		}
	}
}
