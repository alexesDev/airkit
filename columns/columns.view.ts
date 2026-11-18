namespace $.$$ {
	export class $airkit_columns extends $.$airkit_columns {
		override cells() {
			return this.titles().map((_, index) => this.Cell(index))
		}

		override cell_title(index: number) {
			return this.titles()[index]
		}
	}
}
