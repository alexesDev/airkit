namespace $.$$ {
	$mol_test({
		'attention lists an item per entry'($) {
			const entry: $airkit_attention_entry = { count: 2, tone: 'warn', what: 'Keys expire', why: 'this week', action: 'Open keys', arg: { section: 'keys' } }
			const attention = $airkit_attention.make({ $, entries: () => [entry] })

			$mol_assert_equal(attention.items().length, 1)
			$mol_assert_equal(attention.item_count(0), '2')
			$mol_assert_equal(attention.item_tone(0), 'warn')
		},

		'attention with nothing waiting says so'($) {
			const attention = $airkit_attention.make({ $, entries: () => [] })

			$mol_assert_equal(attention.items().length, 0)
			$mol_assert_equal(attention.rows().length, 0)
			$mol_assert_equal(attention.calm_text(), attention.Calm().sub()[0])
		},
	})
}
