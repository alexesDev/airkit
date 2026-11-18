namespace $.$$ {
	export class $airkit_demo_dashboard extends $.$airkit_demo_dashboard {
		@$mol_mem
		override period(next?: $airkit_demo_sample_period): $airkit_demo_sample_period {
			return (this.$.$mol_state_arg.value('period', next) ?? '30d') as $airkit_demo_sample_period
		}

		period_words() {
			switch (this.period()) {
				case '24h': return '24 hours'
				case '7d': return '7 days'
				default: return '30 days'
			}
		}

		override totals_title() {
			return 'Last ' + this.period_words()
		}

		override totals_note() {
			return 'against the ' + this.period_words() + ' before'
		}

		override attention_entries(): readonly $airkit_attention_entry[] {
			return [
				{ count: 1, tone: 'bad', what: 'Job partner-deals is failing', why: '3 of the last 4 runs failed, last success at 13:30', action: 'Open job', arg: { section: 'jobs', job: 'partner-deals' } },
				{ count: 2, tone: 'warn', what: 'Keys expire this week', why: 'notebook on Friday, ci-smoke on Sunday', action: 'Open keys', arg: { section: 'keys' } },
				{ count: 1, tone: 'warn', what: 'Backup is 3 days old', why: 'The nightly backup has not finished since Sunday', action: 'Open jobs', arg: { section: 'jobs' } },
			]
		}

		@$mol_mem
		override requests_series() {
			return $airkit_demo_sample_totals(this.period())
		}

		override requests_value() {
			const total = this.requests_series().reduce((sum, value) => sum + value, 0)

			return total.toFixed(1)
		}

		override requests_delta() {
			switch (this.period()) {
				case '24h': return -4
				case '7d': return 9
				default: return 18
			}
		}

		override errors_value() {
			return this.period() === '24h' ? '1.2' : '0.4'
		}

		override errors_delta() {
			return this.period() === '24h' ? 0.7 : -0.2
		}

		override chart_series() {
			return $airkit_demo_sample_requests(this.period())
		}

		override chart_labels() {
			return $airkit_demo_sample_labels(this.period())
		}

		override feed_entries(): readonly $airkit_feed_entry[] {
			return [
				{ time: '14:02', who: 'admin@example.com', what: 'revoked key old-laptop' },
				{ time: '14:00', who: 'partner-deals', what: 'failed: check «rows > 0»' },
				{ time: '09:31', who: 'anna@example.com', what: 'created key notebook' },
				{ time: '06:00', who: 'nightly-backup', what: 'did not finish in 2 h' },
			]
		}
	}
}
