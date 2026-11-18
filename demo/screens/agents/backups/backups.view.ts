namespace $.$$ {
	const state_tones: Record<$airkit_demo_screens_agents_backup_state, $airkit_tone> = {
		queued: 'warn',
		running: 'warn',
		complete: 'ok',
		failed: 'bad',
	}

	export class $airkit_demo_screens_agents_backups extends $.$airkit_demo_screens_agents_backups {
		agent() {
			return this.store().agent(this.agent_id())
		}

		backups() {
			return this.store().backups(this.agent_id())
		}

		backup(index: number) {
			return this.backups()[index]
		}

		@$mol_mem
		override schedule_enabled(next?: string) {
			return next ?? (this.agent().backup_enabled ? 'on' : 'off')
		}

		@$mol_mem
		override schedule_time(next?: string) {
			return next ?? this.agent().backup_time
		}

		@$mol_mem
		override message(next?: string) {
			return next ?? ''
		}

		override can_capture() {
			return !this.agent().archived && !this.store().in_progress(this.agent_id())
		}

		override save(next?: null) {
			if (next === undefined) return null

			const refusal = this.store().save_schedule(this.agent_id(), this.schedule_enabled() === 'on', this.schedule_time())
			this.message(refusal || 'Schedule saved. Times are UTC; missed runs are queued when the panel returns.')

			return null
		}

		override capture(next?: null) {
			if (next === undefined) return null

			const result = this.store().capture(this.agent_id(), 'manual')
			this.message(result.refusal || 'Backup #' + result.id + ' queued')

			return null
		}

		create_export(backup: number) {
			const refusal = this.store().create_export(this.agent_id(), backup, Number(this.ttl()))
			this.message(refusal || 'Export queued. The link appears when ready; keep this page open to copy it.')
		}

		override export_new(next?: null) {
			if (next === undefined) return null
			this.create_export(0)

			return null
		}

		override export_existing(index: number, next?: null) {
			if (next === undefined) return null
			this.create_export(this.backup(index).id)

			return null
		}

		override export_status() {
			const state = this.store().export_state(this.agent_id())

			return state ? 'Export: ' + state : ''
		}

		override export_uri() {
			if (this.store().export_state(this.agent_id()) !== 'ready') return ''

			return this.store().export(this.agent_id())?.url ?? ''
		}

		override export_title() {
			return 'Download agent .tar.gz · expires ' + this.store().export(this.agent_id())?.expires + ' · copy this link to share'
		}

		override history_rows() {
			return this.backups().map((_, index) => this.History_row(index))
		}

		override number(index: number) {
			return '#' + this.backup(index).id
		}

		override state(index: number) {
			return this.backup(index).state
		}

		override state_tone(index: number) {
			return state_tones[this.backup(index).state]
		}

		override details(index: number) {
			const row = this.backup(index)
			const size = row.bytes ? (row.bytes / 1048576).toFixed(1) + ' MiB encrypted' : ''
			const duration = row.started && row.finished ? Math.round((Date.parse(row.finished) - Date.parse(row.started)) / 1000) + ' s' : ''

			return [row.reason, row.created, size, duration, row.error].filter(Boolean).join(' · ')
		}

		override can_export(index: number) {
			return this.backup(index).state === 'complete'
		}

		can_restore(index: number) {
			return this.can_capture() && this.backup(index).state === 'complete'
		}

		override restore_arg(index: number) {
			return String(this.backup(index).id)
		}

		override restore_slot(index: number) {
			return this.can_restore(index) ? [this.Restore(index)] : [this.Restore_off(index)]
		}

		override content() {
			return [
				this.Note(),
				...this.message() ? [this.Message()] : [],
				this.Schedule(),
				this.Actions(),
				...this.export_status() ? [this.Export_status()] : [],
				...this.export_uri() ? [this.Export_link()] : [],
				this.History(),
			]
		}
	}
}
