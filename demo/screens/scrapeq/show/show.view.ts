namespace $.$$ {
	export class $airkit_demo_screens_scrapeq_show extends $.$airkit_demo_screens_scrapeq_show {
		job() {
			return this.store().job(this.job_id())
		}

		run(id: string) {
			return this.store().run(this.job_id(), id)
		}

		override menu_body() {
			return [
				...this.message() ? [this.Message()] : [],
				...this.reasons() ? [this.Reasons()] : [],
				this.Meta(),
				...this.examples() ? [this.Examples()] : [],
				this.Runs(),
			]
		}

		override runs_content() {
			if (!this.job().runs.length) return [this.Menu_links()]

			return [this.Strip(), this.Columns(), this.Menu_links()]
		}

		@$mol_mem
		override spreads(): Record<string, $mol_view> {
			const spreads: Record<string, $mol_view> = {}
			for (const run of this.job().runs) spreads[run.id] = this.Run_page(run.id)

			return spreads
		}

		override spread_ids() {
			return this.job().runs.map(run => run.id)
		}

		override spread_title(id: string) {
			return `Run ${id}`
		}

		override job_actions() {
			if (this.job().type === 'WEBHOOK') return []

			return super.job_actions()
		}

		override pause_title() {
			return this.job().paused ? 'Resume' : 'Pause'
		}

		override reasons() {
			return this.job().reasons.join('\n')
		}

		override examples() {
			return this.job().examples.map(example => {
				const outcome = `${example.name}: ${example.outcome.toLowerCase().replace('_', ' ')}`

				return example.failed_check ? `${outcome}, ${example.failed_check}` : outcome
			}).join('; ')
		}

		override meta() {
			const job = this.job()
			const reply: Record<string, string> = job.type === 'WEBHOOK' ? { Reply: job.reply.toLowerCase() } : {}

			return {
				Status: job.status,
				'Failed check': job.failed_check || '-',
				Type: $airkit_demo_screens_scrapeq_type_label(job.type),
				'Schedule (UTC)': job.schedule || '-',
				...reply,
				Timeout: `${job.timeout} s`,
				Paused: job.paused ? 'yes' : 'no',
				Saved: job.saved,
				'Last success': job.last_success || '-',
				'Cursor moved': job.cursor_moved || '-',
			}
		}

		override strip() {
			return [...this.job().runs].reverse().map(run => $airkit_demo_screens_scrapeq_tick($airkit_demo_screens_scrapeq_state(run)))
		}

		override run_id(id: string) {
			return id
		}

		override run_outcome(id: string) {
			return $airkit_demo_screens_scrapeq_state(this.run(id))
		}

		override run_tone(id: string) {
			return $airkit_demo_screens_scrapeq_outcome_tone(this.run_outcome(id))
		}

		override run_queued(id: string) {
			return this.run(id).queued
		}

		override trigger(next?: null) {
			if (next === undefined) return null

			const refusal = this.store().trigger(this.job_id())
			this.message(refusal || 'Queued: the run shows below once it starts.')

			return null
		}

		override pause(next?: null) {
			if (next === undefined) return null

			const paused = !this.job().paused
			const refusal = this.store().pause(this.job_id(), paused)
			if (refusal) {
				this.message(refusal)

				return null
			}

			this.message(paused ? 'Paused: the schedule runs nothing until you resume.' : 'Resumed: the schedule runs it again.')

			return null
		}
	}
}
