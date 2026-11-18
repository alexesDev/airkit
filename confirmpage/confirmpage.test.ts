namespace $.$$ {
	$mol_test({
		'confirm page shows a refusal and stays open'($) {
			const refuse = () => {
				throw new Error('already revoked')
			}
			const page = $airkit_confirmpage.make({ $, run: refuse })
			page.confirm(null)

			$mol_assert_equal(page.message(), 'already revoked')
		},
	})
}
