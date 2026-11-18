namespace $.$$ {
	export class $airkit_demo_jobs extends $.$airkit_demo_jobs {
		@$mol_mem
		override filter(next?: string) {
			return this.$.$mol_state_arg.value('job_filter', next) ?? 'all'
		}

		@$mol_mem
		override spreads(): Record<string, $mol_view> {
			const spreads: Record<string, $mol_view> = {}
			for (const job of $airkit_demo_jobs_sample) spreads[job.id] = this.Show(job.id)

			return spreads
		}

		@$mol_mem
		override spread_ids_filtered() {
			const filter = this.filter()
			const ids = super.spread_ids_filtered()
			if (filter === 'all') return ids

			return ids.filter(id => this.job(id).status === filter)
		}

		override filter_counts() {
			const jobs = $airkit_demo_jobs_sample

			return {
				all: jobs.length,
				failing: jobs.filter(job => job.status === 'failing').length,
				paused: jobs.filter(job => job.status === 'paused').length,
			}
		}

		override job_id(id: string) {
			return id
		}

		job(id: string) {
			return $airkit_demo_jobs_find(id)
		}

		override row_name(id: string) {
			return id
		}

		override row_status(id: string) {
			return this.job(id).status
		}

		override row_tone(id: string) {
			return $airkit_demo_jobs_tone(this.job(id).status)
		}

		override row_runs(id: string) {
			return this.job(id).runs
		}

		override row_next(id: string) {
			return this.job(id).next
		}
	}
}
