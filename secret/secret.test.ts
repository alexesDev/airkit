namespace $.$$ {
	$mol_test({
		'secret starts shown with its value and a copy button'($) {
			const secret = $airkit_secret.make({ $, value: () => 'sk_test' })

			$mol_assert_equal(secret.stage(), 'shown')
			$mol_assert_equal(secret.parts().includes(secret.Row()), true)
			$mol_assert_equal(secret.copy_label(), secret.copy_title())
		},

		'secret says it was copied'($) {
			const secret = $airkit_secret.make({ $, value: () => 'sk_test' })
			secret.stage('copied')

			$mol_assert_equal(secret.copy_label(), secret.copied_title())
			$mol_assert_equal(secret.note_shown(), secret.copied_text())
		},

		'secret is gone after done'($) {
			const secret = $airkit_secret.make({ $, value: () => 'sk_test' })
			secret.done(null)

			$mol_assert_equal(secret.stage(), 'gone')
			$mol_assert_equal(secret.parts(), [secret.Gone()])
		},
	})
}
