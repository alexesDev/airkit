namespace $.$$ {
	export class $airkit_chart extends $.$airkit_chart {
		@$mol_mem
		override series_x() {
			return this.labels().map((_, index) => index)
		}

		@$mol_mem_key
		override stacked(index: number) {
			const series = this.series().slice(0, index + 1)

			return this.series_x().map(x => series.reduce((sum, one) => sum + (one.values[x] ?? 0), 0))
		}

		@$mol_mem
		override ruler_step() {
			const top = Math.max(0, ...this.stacked(this.series().length - 1))
			if (top <= 0) return 1

			const rough = top / 4
			const power = 10 ** Math.floor(Math.log10(rough))
			const nice = [1, 2, 2.5, 5, 10].find(factor => factor * power >= rough) ?? 10

			return nice * power
		}

		override bar_width() {
			return (60 / Math.max(this.labels().length, 1)).toFixed(2) + '%'
		}

		override series_color(index: number) {
			if (this.series()[index]?.rest) return 'var(--airkit_series_rest)'

			return `var(--airkit_series_${index % 8 + 1})`
		}

		override series_title(index: number) {
			return this.series()[index].title
		}

		@$mol_mem_key
		override series_total(index: number) {
			const total = this.series()[index].values.reduce((sum, value) => sum + value, 0)

			const digits = this.total_digits()
			const format = { minimumFractionDigits: digits, maximumFractionDigits: digits }

			return total.toLocaleString(this.$.$mol_locale.lang(), format)
		}

		@$mol_mem
		override graphs() {
			const bars = this.series().map((_, index) => this.Bar(index)).reverse()

			return [this.Ruler(), ...bars, this.Marks()]
		}

		@$mol_mem
		override legend() {
			return this.series().map((_, index) => this.Legend_item(index))
		}
	}
}
