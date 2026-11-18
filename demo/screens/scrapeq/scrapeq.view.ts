namespace $.$$ {
	export class $airkit_demo_screens_scrapeq extends $.$airkit_demo_screens_scrapeq {
		@$mol_mem
		override spreads(): Record<string, $mol_view> {
			const spreads: Record<string, $mol_view> = {}
			for (const job of this.store().jobs()) spreads[job.id] = this.Show_page(job.id)

			return spreads
		}

		override spread_title(id: string) {
			return id
		}

		job(id: string) {
			return this.store().job(id)
		}

		last(id: string) {
			return this.job(id).runs[0] ?? null
		}

		override row_id(id: string) {
			return id
		}

		override job_name(id: string) {
			return this.job(id).id
		}

		override job_type(id: string) {
			return $airkit_demo_screens_scrapeq_type_label(this.job(id).type)
		}

		override job_schedule(id: string) {
			return this.job(id).schedule || '-'
		}

		override job_status(id: string) {
			return this.job(id).status
		}

		override job_tone(id: string) {
			return $airkit_demo_screens_scrapeq_status_tone(this.job(id).status)
		}

		override job_paused(id: string) {
			return this.job(id).paused ? 'paused' : 'no'
		}

		override job_last_run(id: string) {
			const run = this.last(id)
			if (!run) return 'never'

			return $airkit_demo_screens_scrapeq_state(run)
		}

		override job_last_tone(id: string) {
			return $airkit_demo_screens_scrapeq_outcome_tone(this.job_last_run(id))
		}

		override job_last_at(id: string) {
			const run = this.last(id)
			if (!run) return ''

			return run.finished || run.started || run.queued
		}
	}
}
