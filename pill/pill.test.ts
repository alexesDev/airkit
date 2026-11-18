namespace $.$$ {
	$mol_test({
		'pill exposes its tone to the stylesheet'($) {
			const pill = $airkit_pill.make({ $, tone: () => 'bad' })

			$mol_assert_equal(pill.attr().airkit_pill_tone, 'bad')
		},
	})
}
