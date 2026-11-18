namespace $.$$ {
	export class $airkit_demo_jobs_show extends $.$airkit_demo_jobs_show {
		job() {
			return $airkit_demo_jobs_find(this.job_id())
		}

		@$mol_mem
		paused(next?: boolean) {
			return next ?? this.job().status === 'paused'
		}

		@$mol_mem
		ran(next?: number) {
			return next ?? 0
		}

		override pause_title() {
			return this.paused() ? 'Resume' : 'Pause'
		}

		override pause(next?: null) {
			if (next === undefined) return null
			this.paused(!this.paused())

			return null
		}

		override run_enabled() {
			return !this.paused()
		}

		override run(next?: null) {
			if (next === undefined) return null
			this.$.$mol_wait_timeout(800)
			this.ran(this.ran() + 1)

			return null
		}

		override problem_title() {
			const runs = this.job().runs.filter(state => state !== 'none')
			const recent = runs.slice(-4)
			const failed = recent.filter(state => state === 'bad').length

			return `${failed} of the last ${recent.length} runs failed`
		}

		override problem_text() {
			return this.job().problem
		}

		override success() {
			return this.job().success
		}

		override success_delta() {
			return this.job().success_delta
		}

		override median() {
			return this.job().median
		}

		override rows() {
			return this.job().rows
		}

		override schedule() {
			const job = this.job()

			return {
				Schedule: job.schedule,
				Type: job.kind,
				Timeout: job.timeout,
				'Next run': this.paused() ? 'paused' : job.next,
			}
		}

		override feed(): readonly $airkit_feed_entry[] {
			const manual = Array.from({ length: this.ran() }, () => ({ time: '14:05', who: 'ok', what: 'manual run, ' + this.job().rows + ' rows, 4.0 s', tone: 'ok' as const }))
			const runs = this.job().feed.map(run => ({
				time: run.time,
				who: run.state === 'bad' ? 'failed' : 'ok',
				what: run.text,
				tone: run.state === 'bad' ? 'bad' as const : 'ok' as const,
			}))

			return [...manual, ...runs]
		}

		override body() {
			return [
				...this.job().problem ? [this.Problem()] : [],
				this.Tiles(),
				this.Schedule(),
				this.Runs(),
			]
		}
	}
}
