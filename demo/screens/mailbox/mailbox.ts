namespace $ {
	export type $airkit_demo_screens_mailbox_letter = {
		readonly id: string
		readonly alias: string
		readonly body: string
		readonly depth: number
		readonly received: string
		readonly listed: boolean
		readonly awaiting: boolean
	}

	export class $airkit_demo_screens_mailbox_store extends $mol_object {
		@$mol_mem
		letters(next?: readonly $airkit_demo_screens_mailbox_letter[]) {
			return next ?? [
				{ id: 'Q4M7ZK2XWB5TNC3RDH6PJ8LFVA', alias: 'sales-desk', depth: 1, received: '2026-11-18 13:52', listed: true, awaiting: true, body: 'A customer asks whether **box-1** can keep call recordings for 90 days instead of 30.\n\nCan you confirm the retention we may promise them?' },
				{ id: 'H2V9TQ6WZC4KXB8MNR3JD5LPFE', alias: 'legal-intake', depth: 2, received: '2026-11-18 11:20', listed: true, awaiting: true, body: 'Following up on my earlier letter.\n\n- the signed contract from **admin@example.com** arrived\n- it has 14 pages and one changed clause\n\nShall I file it and confirm to the customer, or do you want to check it first?' },
				{ id: 'B8KX3NWQ7ZT5MC2RVD9HJ4LPFG', alias: 'onboarding', depth: 1, received: '2026-11-17 18:05', listed: true, awaiting: false, body: 'I drafted a week-one checklist for the new hire who starts on Monday. May I publish it at https://docs.example.org/onboarding?' },
			]
		}

		letter(id: string) {
			const found = this.letters().find(letter => letter.id === id)
			if (!found) throw new Error(`Letter ${id} is gone`)

			return found
		}

		pending() {
			return this.letters().filter(letter => letter.listed)
		}

		resolve(id: string) {
			this.$.$mol_wait_timeout(600)

			const awaiting = this.letter(id).awaiting
			this.letters(this.letters().map(letter => letter.id === id ? { ...letter, listed: false, awaiting: false } : letter))

			return awaiting ? '' : 'the letter is not awaiting approval'
		}
	}
}
