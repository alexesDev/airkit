namespace $.$$ {
	export class $airkit_demo_screens_mailbox_overview extends $.$airkit_demo_screens_mailbox_overview {
		override entries(): readonly $airkit_attention_entry[] {
			const approvals = this.approvals_waiting()
			if (!approvals) return []

			return [
				{ count: approvals, tone: 'warn', what: 'Waiting for your approval', why: '', action: '', arg: this.approvals_arg() },
				{ count: 0, tone: 'neutral', what: 'Waiting for your release', why: '', action: '', arg: {} },
				{ count: 0, tone: 'neutral', what: 'Blocked', why: '', action: '', arg: {} },
			]
		}
	}
}
