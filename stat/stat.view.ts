namespace $.$$ {
	export class $airkit_stat extends $.$airkit_stat {
		override value_shown() {
			return this.measured() ? this.value() : this.not_measured_text()
		}

		override delta_text() {
			const delta = this.delta()
			const arrow = delta > 0 ? '↑' : delta < 0 ? '↓' : '→'

			return arrow + ' ' + Math.abs(delta).toLocaleString(this.$.$mol_locale.lang()) + this.delta_unit()
		}

		override delta_tone(): $airkit_tone {
			const delta = this.delta()
			if (delta === 0) return 'neutral'

			return (delta > 0) === this.higher_is_better() ? 'ok' : 'bad'
		}

		override line() {
			if (!this.measured()) return [this.Value()]

			return [
				this.Value(),
				...this.unit() ? [this.Unit()] : [],
				...Number.isNaN(this.delta()) ? [] : [this.Delta()],
			]
		}

		override parts() {
			return [
				this.Label(),
				this.Line(),
				...this.note() ? [this.Note()] : [],
				...this.measured() && this.portion() >= 0 ? [this.Meter()] : [],
				...this.measured() && this.series().length > 1 ? [this.Spark()] : [],
			]
		}
	}
}
