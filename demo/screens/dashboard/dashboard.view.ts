namespace $.$$ {
	type Bucket = $airkit_demo_screens_dashboard_bucket

	const labels: Record<$airkit_demo_screens_dashboard_period, string> = {
		hours: 'DD.MM hh:00',
		days: 'DD.MM',
		weeks: 'DD.MM',
		months: 'MM.YYYY',
	}

	const metrics: Record<string, (bucket: Bucket) => number> = {
		tokens: bucket => (bucket.inputTokens + bucket.outputTokens) / 1_000_000,
		messages: bucket => bucket.messagesIn + bucket.messagesOut,
	}

	const named_layers = 8

	function format(value: number, metric: string) {
		return metric === 'messages' ? String(Math.round(value)) : `${value.toFixed(1)}M tokens`
	}

	export class $airkit_demo_screens_dashboard extends $.$airkit_demo_screens_dashboard {
		@$mol_mem
		override period(next?: string) {
			return this.$.$mol_state_arg.value('period', next) ?? 'days'
		}

		@$mol_mem
		override metric(next?: string) {
			return this.$.$mol_state_arg.value('metric', next) ?? 'tokens'
		}

		chosen(): $airkit_demo_screens_dashboard_period {
			const period = this.period()

			return period in labels ? period as $airkit_demo_screens_dashboard_period : 'days'
		}

		@$mol_mem
		fleet() {
			return $airkit_demo_screens_dashboard_activity(this.chosen())
		}

		@$mol_mem
		override layers(): readonly $airkit_chart_series[] {
			const measure = metrics[this.metric()] ?? metrics.tokens
			const ranked = this.fleet()
				.map(series => ({ title: series.name, values: series.buckets.map(measure) }))
				.map(layer => ({ ...layer, total: layer.values.reduce((sum, value) => sum + value, 0) }))
				.filter(layer => layer.total > 0)
				.sort((a, b) => b.total - a.total)

			const named = ranked.slice(0, named_layers)
			const rest = ranked.slice(named_layers)
			if (!rest.length) return named

			const others = named[0].values.map((_, index) => rest.reduce((sum, layer) => sum + layer.values[index], 0))

			return [...named, { title: `Others (${rest.length})`, values: others, rest: true }]
		}

		@$mol_mem
		override labels() {
			const buckets = this.fleet()[0]?.buckets ?? []

			return buckets.map(bucket => new $mol_time_moment(bucket.start).toString(labels[this.chosen()]))
		}

		override total_digits() {
			return this.metric() === 'messages' ? 0 : 1
		}

		selected_index() {
			return this.Chart().selected_index()
		}

		@$mol_mem
		shares(): readonly { layer: number, value: number }[] {
			const index = this.selected_index()
			if (index < 0) return []

			return this.layers()
				.map((layer, position) => ({ layer: position, value: layer.values[index] }))
				.filter(share => share.value > 0)
				.sort((a, b) => b.value - a.value)
		}

		shares_total() {
			return this.shares().reduce((sum, share) => sum + share.value, 0)
		}

		override breakdown() {
			if (this.selected_index() < 0) return [this.Breakdown_empty()]

			return [this.Breakdown_title(), ...this.shares().map((_, rank) => this.Share(rank))]
		}

		override breakdown_title() {
			return `${this.labels()[this.selected_index()]}: ${format(this.shares_total(), this.metric())} in all`
		}

		override share_color(rank: number) {
			return this.Chart().series_color(this.shares()[rank].layer)
		}

		override share_name(rank: number) {
			return this.layers()[this.shares()[rank].layer].title
		}

		override share_value(rank: number) {
			const value = this.shares()[rank].value
			const percent = Math.round(value / this.shares_total() * 100)

			return `${format(value, this.metric())} · ${percent}%`
		}

		override link_rows() {
			return $airkit_demo_screens_dashboard_links.map((_, index) => this.Link_row(index))
		}

		link(index: number) {
			return $airkit_demo_screens_dashboard_links[index]
		}

		override link_row_sub(index: number) {
			if (!this.link(index).description) return [this.Link(index)]

			return [this.Link(index), this.Link_description(index)]
		}

		override link_uri(index: number) {
			return this.link(index).url
		}

		override link_label(index: number) {
			return this.link(index).label
		}

		override link_description(index: number) {
			return this.link(index).description
		}

		@$mol_mem
		images() {
			return this.store().images()
		}

		override image_rows() {
			return this.images().map((_, index) => this.Image_row(index))
		}

		image(index: number) {
			return this.images()[index]
		}

		override image_name(index: number) {
			return this.image(index).name
		}

		override image_checked(index: number) {
			switch (this.image(index).checkState) {
				case 'PASSED': return '✓'
				case 'FAILED': return '✗'
				default: return '…'
			}
		}

		override image_tone(index: number): $airkit_tone {
			switch (this.image(index).checkState) {
				case 'PASSED': return 'ok'
				case 'FAILED': return 'bad'
				default: return 'neutral'
			}
		}

		override image_problem(index: number) {
			return this.image(index).checkError ?? ''
		}

		override image_command(index: number) {
			return this.image(index).checkEntrypoint.join(' ')
		}

		override image_ref(index: number) {
			return this.image(index).ref
		}
	}
}
