namespace $.$$ {
	$mol_test({
		'chip shows its count, and nothing when it has none'($) {
			const chips = $airkit_chips.make({ $, counts: () => ({ all: 5, failing: 0 }) })

			$mol_assert_equal(chips.option_count('all'), '5')
			$mol_assert_equal(chips.option_count('failing'), '0')
			$mol_assert_equal(chips.option_count('paused'), '')
		},
	})
}
