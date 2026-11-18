namespace $.$$ {
	export class $airkit_demo_screens_scrapeq_run extends $.$airkit_demo_screens_scrapeq_run {
		run() {
			return this.store().run(this.job_id(), this.run_id())
		}

		override page_title() {
			return `Run ${this.run_id()} of ${this.job_id()}`
		}

		override meta() {
			const run = this.run()
			const deleted = Object.keys(run.deleted).length ? JSON.stringify(run.deleted) : '-'

			return {
				File: run.file || '-',
				Outcome: $airkit_demo_screens_scrapeq_state(run),
				'Failed stage': run.stage || '-',
				Attempts: String(run.attempts),
				Records: String(run.records),
				States: String(run.states),
				Deleted: deleted,
				Queued: run.queued,
				Started: run.started || '-',
				Finished: run.finished || '-',
			}
		}

		override retried() {
			const run = this.run()
			if (!run.retried_error) return ''

			return `Earlier attempt: ${run.retried_stage || 'unknown stage'} – ${run.retried_error}`
		}

		override error() {
			return this.run().error
		}

		override stderr() {
			return this.run().stderr
		}

		override body() {
			return [
				this.Meta(),
				...this.retried() ? [this.Retried()] : [],
				...this.error() ? [this.Error()] : [],
				...this.stderr() ? [this.Stderr()] : [],
			]
		}
	}
}
