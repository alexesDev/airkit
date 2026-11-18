namespace $ {
	export type $airkit_demo_screens_scrapeq_type = 'SCHEDULE_JOB' | 'IMPORTER' | 'WEBHOOK'

	export type $airkit_demo_screens_scrapeq_status = 'READY' | 'TESTING' | 'BLOCKED'

	export type $airkit_demo_screens_scrapeq_job_run = {
		readonly id: string
		readonly queued: string
		readonly started: string
		readonly finished: string
		readonly attempts: number
		readonly outcome: string
		readonly stage: string
		readonly error: string
		readonly retried_stage: string
		readonly retried_error: string
		readonly records: number
		readonly states: number
		readonly deleted: Readonly<Record<string, number>>
		readonly stderr: string
		readonly file: string
	}

	export type $airkit_demo_screens_scrapeq_example = {
		readonly name: string
		readonly outcome: 'PASSED' | 'FAILED' | 'NOT_RUN'
		readonly failed_check: string
	}

	export type $airkit_demo_screens_scrapeq_job = {
		readonly id: string
		readonly type: $airkit_demo_screens_scrapeq_type
		readonly schedule: string
		readonly reply: string
		readonly timeout: number
		readonly paused: boolean
		readonly status: $airkit_demo_screens_scrapeq_status
		readonly failed_check: string
		readonly saved: string
		readonly last_success: string
		readonly cursor_moved: string
		readonly reasons: readonly string[]
		readonly examples: readonly $airkit_demo_screens_scrapeq_example[]
		readonly runs: readonly $airkit_demo_screens_scrapeq_job_run[]
	}

	export function $airkit_demo_screens_scrapeq_type_label(type: $airkit_demo_screens_scrapeq_type) {
		const labels: Record<$airkit_demo_screens_scrapeq_type, string> = {
			SCHEDULE_JOB: 'schedule',
			IMPORTER: 'importer',
			WEBHOOK: 'webhook',
		}

		return labels[type]
	}

	export function $airkit_demo_screens_scrapeq_state(run: $airkit_demo_screens_scrapeq_job_run) {
		if (run.outcome) return run.outcome
		if (run.started) return 'running'

		return 'queued'
	}

	export function $airkit_demo_screens_scrapeq_status_tone(status: $airkit_demo_screens_scrapeq_status): $airkit_tone {
		switch (status) {
			case 'READY': return 'ok'
			case 'BLOCKED': return 'warn'
			default: return 'neutral'
		}
	}

	export function $airkit_demo_screens_scrapeq_outcome_tone(state: string): $airkit_tone {
		switch (state) {
			case 'ok': return 'ok'
			case 'dead': return 'bad'
			default: return 'neutral'
		}
	}

	export function $airkit_demo_screens_scrapeq_tick(state: string): $airkit_runs_state {
		switch (state) {
			case 'ok': return 'ok'
			case 'dead': return 'bad'
			default: return 'none'
		}
	}

	const quiet: Omit<$airkit_demo_screens_scrapeq_job_run, 'id' | 'queued' | 'started' | 'finished' | 'records'> = {
		attempts: 1,
		outcome: 'ok',
		stage: '',
		error: '',
		retried_stage: '',
		retried_error: '',
		states: 1,
		deleted: {},
		stderr: '',
		file: '',
	}

	function half_hourly(id: number, at: string, records: number): $airkit_demo_screens_scrapeq_job_run {
		return { ...quiet, id: String(id), queued: `2026-11-18 ${at}:00`, started: `2026-11-18 ${at}:01`, finished: `2026-11-18 ${at}:05`, records }
	}

	function daily(id: number, day: string, records: number): $airkit_demo_screens_scrapeq_job_run {
		return { ...quiet, id: String(id), queued: `2026-11-${day} 06:00:00`, started: `2026-11-${day} 06:00:00`, finished: `2026-11-${day} 06:00:02`, records }
	}

	const timed_out: $airkit_demo_screens_scrapeq_job_run = {
		...quiet,
		id: '409',
		queued: '2026-11-18 12:30:00',
		started: '2026-11-18 12:30:01',
		finished: '2026-11-18 12:31:05',
		attempts: 2,
		outcome: 'dead',
		stage: 'timeout',
		error: 'the extractor ran past its 60 s timeout',
		retried_stage: 'exit',
		retried_error: 'the extractor ended with exit status 1',
		records: 0,
		states: 0,
		stderr: 'fetch https://news.example.com/: 503 Service Unavailable, retrying in 20 s\nfetch https://news.example.com/: 503 Service Unavailable, retrying in 40 s',
	}

	const bad_header: $airkit_demo_screens_scrapeq_job_run = {
		...quiet,
		id: '361',
		queued: '2026-11-03 09:30:12',
		started: '2026-11-03 09:30:12',
		finished: '2026-11-03 09:30:14',
		outcome: 'dead',
		stage: 'exit',
		error: 'the extractor ended with exit status 1',
		records: 0,
		states: 0,
		stderr: 'Traceback (most recent call last):\n  File "extractor.py", line 18, in <module>\n    rows = read_orders(sq.file())\n  File "extractor.py", line 9, in read_orders\n    raise ValueError("the header has no column order_id")\nValueError: the header has no column order_id',
		file: 'orders-2026-11-03.csv, 120 bytes',
	}

	export const $airkit_demo_screens_scrapeq_sample: readonly $airkit_demo_screens_scrapeq_job[] = [
		{
			id: 'hn_frontpage',
			type: 'SCHEDULE_JOB',
			schedule: '*/30 * * * *',
			reply: '',
			timeout: 60,
			paused: false,
			status: 'READY',
			failed_check: '',
			saved: '2026-11-18 08:21:37',
			last_success: '2026-11-18 14:00:05',
			cursor_moved: '2026-11-18 14:00:05',
			reasons: [],
			examples: [],
			runs: [
				half_hourly(412, '14:00', 30),
				half_hourly(411, '13:30', 30),
				half_hourly(410, '13:00', 30),
				timed_out,
				half_hourly(408, '12:00', 30),
				half_hourly(407, '11:30', 29),
				half_hourly(406, '11:00', 30),
				half_hourly(405, '10:30', 30),
				half_hourly(404, '10:00', 30),
				half_hourly(403, '09:30', 30),
				half_hourly(402, '09:00', 30),
				half_hourly(401, '08:30', 30),
			],
		},
		{
			id: 'cbr_rates',
			type: 'SCHEDULE_JOB',
			schedule: '0 6 * * *',
			reply: '',
			timeout: 30,
			paused: true,
			status: 'READY',
			failed_check: '',
			saved: '2026-11-09 17:40:12',
			last_success: '2026-11-16 06:00:02',
			cursor_moved: '2026-11-16 06:00:02',
			reasons: [],
			examples: [],
			runs: [
				daily(398, '16', 34),
				daily(390, '15', 34),
				daily(386, '14', 34),
				daily(381, '13', 34),
				daily(379, '12', 34),
				daily(378, '11', 34),
				daily(376, '10', 34),
			],
		},
		{
			id: 'orders_import',
			type: 'IMPORTER',
			schedule: '',
			reply: '',
			timeout: 120,
			paused: false,
			status: 'READY',
			failed_check: '',
			saved: '2026-11-02 16:20:00',
			last_success: '2026-11-17 09:12:07',
			cursor_moved: '',
			reasons: [],
			examples: [],
			runs: [
				{ ...quiet, id: '399', queued: '2026-11-17 09:12:03', started: '2026-11-17 09:12:03', finished: '2026-11-17 09:12:07', records: 312, file: 'orders-2026-11-17.csv, 48213 bytes' },
				{ ...quiet, id: '377', queued: '2026-11-10 09:05:40', started: '2026-11-10 09:05:40', finished: '2026-11-10 09:05:44', records: 340, deleted: { orders: 4 }, file: 'orders-2026-11-10.csv, 51877 bytes' },
				bad_header,
			],
		},
		{
			id: 'partner_deals',
			type: 'SCHEDULE_JOB',
			schedule: '*/15 * * * *',
			reply: '',
			timeout: 60,
			paused: false,
			status: 'BLOCKED',
			failed_check: 'non-empty streams',
			saved: '2026-11-18 13:52:10',
			last_success: '',
			cursor_moved: '',
			reasons: ['check 3, non-empty streams, failed'],
			examples: [
				{ name: 'deals_page1.html', outcome: 'PASSED', failed_check: '' },
				{ name: 'deals_page2.html', outcome: 'FAILED', failed_check: 'non-empty streams' },
			],
			runs: [],
		},
		{
			id: 'price_watch',
			type: 'SCHEDULE_JOB',
			schedule: '@hourly',
			reply: '',
			timeout: 120,
			paused: false,
			status: 'TESTING',
			failed_check: '',
			saved: '2026-11-18 14:03:55',
			last_success: '',
			cursor_moved: '',
			reasons: [],
			examples: [],
			runs: [],
		},
		{
			id: 'lead_webhook',
			type: 'WEBHOOK',
			schedule: '',
			reply: 'SYNC',
			timeout: 10,
			paused: false,
			status: 'READY',
			failed_check: '',
			saved: '2026-11-18 11:02:31',
			last_success: '',
			cursor_moved: '',
			reasons: ['nothing delivers requests to this webhook job yet; it has no URL to give out'],
			examples: [],
			runs: [],
		},
	]

	export class $airkit_demo_screens_scrapeq_store extends $mol_object {
		@$mol_mem
		jobs(next?: readonly $airkit_demo_screens_scrapeq_job[]) {
			return next ?? $airkit_demo_screens_scrapeq_sample
		}

		job(id: string) {
			const found = this.jobs().find(job => job.id === id)
			if (!found) throw new Error(`Job ${id} is gone`)

			return found
		}

		run(job_id: string, run_id: string) {
			const found = this.job(job_id).runs.find(run => run.id === run_id)
			if (!found) throw new Error(`Run ${run_id} of ${job_id} is not among the last 50`)

			return found
		}

		replace(changed: $airkit_demo_screens_scrapeq_job) {
			this.jobs(this.jobs().map(job => job.id === changed.id ? changed : job))
		}

		trigger(id: string) {
			this.$.$mol_wait_timeout(600)

			const job = this.job(id)
			if (job.status !== 'READY') return `job ${id} is ${job.status.toLowerCase()}, and only a ready job runs`
			if (job.type === 'WEBHOOK') return `job ${id} is a webhook job: neither triggerJob nor uploadFile runs it, and nothing delivers requests to it yet`
			if (job.type === 'IMPORTER') return `job ${id} is an importer; it runs when uploadFile hands it a file`
			if (job.paused) return `job ${id} is paused; unpause it with pauseJob first`
			if (job.runs.some(run => !run.finished)) return `a run of ${id} is already queued or running`

			const next_id = Math.max(0, ...this.jobs().flatMap(each => each.runs.map(run => Number(run.id)))) + 1
			const queued: $airkit_demo_screens_scrapeq_job_run = { ...quiet, id: String(next_id), queued: '2026-11-18 14:05:12', started: '', finished: '', outcome: '', records: 0, states: 0 }

			this.replace({ ...job, runs: [queued, ...job.runs].slice(0, 50) })

			return ''
		}

		pause(id: string, paused: boolean) {
			this.$.$mol_wait_timeout(500)

			const job = this.job(id)
			if (job.type === 'WEBHOOK') return `job ${id} is a webhook job, which has no schedule to pause, and nothing delivers requests to it yet`

			this.replace({ ...job, paused })

			return ''
		}
	}
}
