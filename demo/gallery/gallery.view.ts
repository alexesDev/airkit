namespace $.$$ {
	const rows = [
		{ name: 'deploy-script', status: 'active', tone: 'ok', owner: 'admin@example.com', used: '2026-11-18 13:40' },
		{ name: 'nightly-ci', status: 'expiring', tone: 'warn', owner: 'admin@example.com', used: '2026-11-17 02:00' },
		{ name: 'retired-cli', status: 'revoked', tone: 'neutral', owner: 'anna@example.com', used: '2026-10-02 18:11' },
		{ name: 'data-notebook', status: 'expiring', tone: 'warn', owner: 'anna@example.com', used: '' },
	] as const

	export class $airkit_demo_gallery extends $.$airkit_demo_gallery {
		override spark_series() {
			return $airkit_demo_sample_totals('30d')
		}

		override attention_entries(): readonly $airkit_attention_entry[] {
			return [
				{ count: 1, tone: 'bad', what: 'Job partner-deals is failing', why: '3 of the last 4 runs failed, last success at 13:30', action: 'Open job', arg: { section: 'jobs', job: 'partner-deals' } },
				{ count: 2, tone: 'warn', what: 'Keys expire this week', why: 'data-notebook on Friday, nightly-ci on Sunday', action: 'Open keys', arg: { section: 'keys' } },
			]
		}

		override feed_entries(): readonly $airkit_feed_entry[] {
			return [
				{ time: '14:02', who: 'admin@example.com', what: 'revoked key retired-cli' },
				{ time: '14:00', who: 'partner-deals', what: 'failed: check «rows > 0»' },
				{ time: '13:45', who: 'failed', what: 'check «rows > 0», 4.4 s', tone: 'bad' },
				{ time: '13:30', who: 'ok', what: '198 rows, 4.0 s', tone: 'ok' },
			]
		}

		override chart_series() {
			return $airkit_demo_sample_requests('30d')
		}

		override chart_labels() {
			return $airkit_demo_sample_labels('30d')
		}

		override list_rows() {
			return rows.map((_, index) => this.List_row(index))
		}

		override list_name(index: number) {
			return rows[index].name
		}

		override list_status(index: number) {
			return rows[index].status
		}

		override list_tone(index: number) {
			return rows[index].tone
		}

		override list_owner(index: number) {
			return rows[index].owner
		}

		override list_used(index: number) {
			return rows[index].used
		}

		override name_bid() {
			return /^[a-z0-9-]+$/.test(this.name()) ? '' : 'Lowercase letters, digits and dashes only'
		}

		override submit(next?: null) {
			if (next === undefined) return null
			this.form_message(this.name_bid() ? 'Fix the name to continue.' : 'Sample form: nothing is saved.')

			return null
		}
	}
}
