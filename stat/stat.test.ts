namespace $.$$ {
	$mol_test({
		'stat shows a sentence instead of a value it did not measure'($) {
			const stat = $airkit_stat.make({ $, value: () => '42', measured: () => false })

			$mol_assert_equal(stat.value_shown(), stat.not_measured_text())
			$mol_assert_equal(stat.line().length, 1)
		},

		'stat shows its value, unit and delta when measured'($) {
			const stat = $airkit_stat.make({ $, value: () => '42', unit: () => '%', delta: () => 18 })

			$mol_assert_equal(stat.value_shown(), '42')
			$mol_assert_equal(stat.line().length, 3)
		},

		'stat leaves the delta out when there is none'($) {
			const stat = $airkit_stat.make({ $, value: () => '42' })

			$mol_assert_equal(stat.line().length, 1)
		},

		'delta text carries its direction and unit'($) {
			const up = $airkit_stat.make({ $, delta: () => 18 })
			const down = $airkit_stat.make({ $, delta: () => -4, delta_unit: () => ' pt' })

			$mol_assert_equal(up.delta_text(), '↑ 18%')
			$mol_assert_equal(down.delta_text(), '↓ 4 pt')
		},

		'delta tone depends on which direction is better'($) {
			const growth = $airkit_stat.make({ $, delta: () => 5 })
			const errors = $airkit_stat.make({ $, delta: () => 5, higher_is_better: () => false })
			const flat = $airkit_stat.make({ $, delta: () => 0 })

			$mol_assert_equal(growth.delta_tone(), 'ok')
			$mol_assert_equal(errors.delta_tone(), 'bad')
			$mol_assert_equal(flat.delta_tone(), 'neutral')
		},

		'stat adds a meter only for a portion'($) {
			const plain = $airkit_stat.make({ $, label: () => 'Disk', value: () => '1' })
			const metered = $airkit_stat.make({ $, label: () => 'Disk', value: () => '1', portion: () => .5 })

			$mol_assert_equal(plain.parts().includes(plain.Meter()), false)
			$mol_assert_equal(metered.parts().includes(metered.Meter()), true)
		},
	})
}
