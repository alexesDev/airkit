namespace $.$$ {
	export class $airkit_demo_screens_dashboard_chart extends $.$airkit_demo_screens_dashboard_chart {
		@$mol_mem
		override graphs() {
			return [...super.graphs(), this.Cursor()]
		}

		@$mol_mem
		latest_index() {
			const series = this.series()

			for (let index = this.labels().length - 1; index >= 0; index--) {
				if (series.some(one => (one.values[index] ?? 0) > 0)) return index
			}

			return -1
		}

		@$mol_mem
		override selected_index() {
			const plot = this.Plot()
			const [cursor_x] = plot.cursor_position()
			if (Number.isNaN(cursor_x)) return this.latest_index()

			const index = Math.round((cursor_x - plot.shift()[0]) / plot.scale()[0])

			return index >= 0 && index < this.labels().length ? index : this.latest_index()
		}

		override cursor_curve() {
			const index = this.selected_index()
			if (index < 0) return ''

			const plot = this.Plot()
			const x = plot.shift()[0] + index * plot.scale()[0]
			const bottom = plot.size_real().y - plot.gap_bottom()

			return `M ${x.toFixed(3)} ${bottom.toFixed(3)} V ${plot.gap_top()}`
		}
	}
}
