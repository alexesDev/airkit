namespace $.$$ {
	$mol_test({
		'chart stacks each series on the ones before it'($) {
			const series = [{ title: 'a', values: [1, 2] }, { title: 'b', values: [3, 4] }]
			const chart = $airkit_chart.make({ $, series: () => series, labels: () => ['x', 'y'] })

			$mol_assert_equal(chart.stacked(0), [1, 2])
			$mol_assert_equal(chart.stacked(1), [4, 6])
		},

		'chart legend carries each series total'($) {
			const series = [{ title: 'a', values: [1.25, 2] }]
			const chart = $airkit_chart.make({ $, series: () => series, labels: () => ['x', 'y'], total_digits: () => 1 })

			$mol_assert_equal(chart.series_total(0), (3.25).toLocaleString($.$mol_locale.lang(), { minimumFractionDigits: 1, maximumFractionDigits: 1 }))
		},

		'chart paints the rest grey and the others from the palette'($) {
			const series = [{ title: 'a', values: [1] }, { title: 'other', values: [1], rest: true }]
			const chart = $airkit_chart.make({ $, series: () => series, labels: () => ['x'] })

			$mol_assert_equal(chart.series_color(0), 'var(--airkit_series_1)')
			$mol_assert_equal(chart.series_color(1), 'var(--airkit_series_rest)')
		},

		'chart y axis steps by a round quarter of its top'($) {
			const series = [{ title: 'a', values: [10, 38] }]
			const chart = $airkit_chart.make({ $, series: () => series, labels: () => ['x', 'y'] })

			$mol_assert_equal(chart.ruler_step(), 10)
		},
	})
}
