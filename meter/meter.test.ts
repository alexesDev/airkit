namespace $.$$ {
	$mol_test({
		'meter clamps its portion to the bar'($) {
			const over = $airkit_meter.make({ $, portion: () => 1.7 })
			const under = $airkit_meter.make({ $, portion: () => -1 })

			$mol_assert_equal(over.percent(), 100)
			$mol_assert_equal(over.fill_width(), '100%')
			$mol_assert_equal(under.percent(), 0)
		},

		'meter draws a tick only when given one'($) {
			const plain = $airkit_meter.make({ $, portion: () => .4 })
			const limited = $airkit_meter.make({ $, portion: () => .4, tick: () => .8 })

			$mol_assert_equal(plain.parts().length, 1)
			$mol_assert_equal(limited.parts().length, 2)
			$mol_assert_equal(limited.tick_left(), '80%')
		},
	})
}
