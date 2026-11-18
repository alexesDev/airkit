namespace $.$$ {
	export class $airkit_meter extends $.$airkit_meter {
		override percent() {
			return Math.round(Math.min(Math.max(this.portion(), 0), 1) * 100)
		}

		override fill_width() {
			return this.percent() + '%'
		}

		override tick_left() {
			return Math.round(this.tick() * 100) + '%'
		}

		override parts() {
			return this.tick() < 0 ? [this.Fill()] : [this.Fill(), this.Tick()]
		}
	}
}
