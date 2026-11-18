namespace $.$$ {
	$mol_test({
		'kv card renders a pair per field, in order'($) {
			const kv = $airkit_kv.make({ $, fields: () => ({ Owner: 'ops', Timeout: '60 s' }) })

			$mol_assert_equal(kv.pairs().length, 2)
			$mol_assert_equal(kv.key('Timeout'), 'Timeout')
			$mol_assert_equal(kv.field_value('Timeout'), '60 s')
		},
	})
}
