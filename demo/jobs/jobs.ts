namespace $ {
	export type $airkit_demo_jobs_status = 'ok' | 'failing' | 'paused'

	export type $airkit_demo_jobs_run = {
		readonly time: string
		readonly state: $airkit_runs_state
		readonly text: string
	}

	export type $airkit_demo_jobs_job = {
		readonly id: string
		readonly status: $airkit_demo_jobs_status
		readonly runs: readonly $airkit_runs_state[]
		readonly next: string
		readonly schedule: string
		readonly kind: string
		readonly timeout: string
		readonly success: string
		readonly success_delta: number
		readonly median: string
		readonly rows: string
		readonly problem: string
		readonly feed: readonly $airkit_demo_jobs_run[]
	}

	export function $airkit_demo_jobs_tone(status: $airkit_demo_jobs_status): $airkit_tone {
		switch (status) {
			case 'ok': return 'ok'
			case 'failing': return 'bad'
			default: return 'neutral'
		}
	}

	const ok_feed = (rows: string): readonly $airkit_demo_jobs_run[] => [
		{ time: '14:00', state: 'ok', text: rows + ' rows, 3.8 s' },
		{ time: '13:45', state: 'ok', text: rows + ' rows, 4.0 s' },
		{ time: '13:30', state: 'ok', text: rows + ' rows, 3.9 s' },
	]

	export const $airkit_demo_jobs_sample: readonly $airkit_demo_jobs_job[] = [
		{ id: 'news-frontpage', status: 'ok', runs: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok'], next: 'in 28 min', schedule: 'every 30 minutes', kind: 'extractor', timeout: '60 s', success: '100', success_delta: 0, median: '3.9', rows: '30', problem: '', feed: ok_feed('30') },
		{ id: 'exchange-rates', status: 'ok', runs: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok'], next: 'in 16 h', schedule: 'daily at 06:00', kind: 'extractor', timeout: '30 s', success: '100', success_delta: 0, median: '1.2', rows: '34', problem: '', feed: ok_feed('34') },
		{ id: 'partner-deals', status: 'failing', runs: ['ok', 'ok', 'ok', 'ok', 'ok', 'ok', 'bad', 'ok', 'bad', 'bad'], next: 'in 11 min', schedule: 'every 15 minutes', kind: 'extractor', timeout: '60 s', success: '91', success_delta: -9, median: '4.1', rows: '198', problem: 'Check «rows > 0» did not pass: the extractor returned 0 rows. Last success 30 minutes ago, at 13:30.', feed: [
			{ time: '14:00', state: 'bad', text: 'check «rows > 0», 3.9 s' },
			{ time: '13:45', state: 'bad', text: 'check «rows > 0», 4.4 s' },
			{ time: '13:30', state: 'ok', text: '198 rows, 4.0 s' },
			{ time: '13:15', state: 'bad', text: 'check «rows > 0», 4.1 s' },
		] },
		{ id: 'competitor-prices', status: 'ok', runs: ['ok', 'ok', 'ok', 'bad', 'ok', 'ok', 'ok', 'ok', 'ok', 'ok'], next: 'in 29 min', schedule: 'every hour', kind: 'browser', timeout: '120 s', success: '96', success_delta: 2, median: '22', rows: '412', problem: '', feed: ok_feed('412') },
		{ id: 'weekly-digest', status: 'paused', runs: ['ok', 'ok', 'ok', 'ok', 'ok', 'none', 'none', 'none', 'none', 'none'], next: '', schedule: 'Mondays at 09:00', kind: 'report', timeout: '300 s', success: '100', success_delta: 0, median: '41', rows: '1', problem: '', feed: ok_feed('1') },
	]

	export function $airkit_demo_jobs_find(id: string) {
		const found = $airkit_demo_jobs_sample.find(job => job.id === id)
		if (!found) throw new Error(`Job ${id} is gone`)

		return found
	}
}
