namespace $.$$ {
	$mol_test({
		'runs strip has a tick per run'($) {
			const runs = $airkit_runs.make({ $, runs: () => ['ok', 'bad', 'none'] })

			$mol_assert_equal(runs.ticks().length, 3)
			$mol_assert_equal(runs.tick_state(1), 'bad')
		},

		'runs strip summarises failures among the runs that happened'($) {
			const runs = $airkit_runs.make({ $, runs: () => ['ok', 'bad', 'bad', 'none'] })

			$mol_assert_equal(runs.summary(), '2 of the last 3 runs failed')
		},
	})
}
