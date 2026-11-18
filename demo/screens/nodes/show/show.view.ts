namespace $.$$ {
	type Key = $airkit_demo_screens_nodes_key

	export class $airkit_demo_screens_nodes_show extends $.$airkit_demo_screens_nodes_show {
		node() {
			return $airkit_demo_screens_nodes_find(this.node_name())
		}

		agents(): readonly $airkit_demo_screens_nodes_agent[] {
			return this.node().codexBroker?.window?.agents ?? []
		}

		override url() {
			return this.node().codexOperatorUrl
		}

		override credential_text() {
			return $airkit_demo_screens_nodes_credential(this.node()).text
		}

		override credential_tone() {
			return $airkit_demo_screens_nodes_credential(this.node()).tone
		}

		override observed() {
			return $airkit_demo_screens_nodes_observed(this.node())
		}

		quota(key: Key) {
			return $airkit_demo_screens_nodes_quota(this.node(), key)
		}

		override primary_value() {
			return String(this.quota('primary_window').used)
		}

		override primary_measured() {
			return this.quota('primary_window').used !== null
		}

		override primary_portion() {
			return (this.quota('primary_window').used ?? -100) / 100
		}

		override primary_note() {
			return this.quota('primary_window').reset
		}

		override primary_missing() {
			return this.quota('primary_window').missing
		}

		override secondary_value() {
			return String(this.quota('secondary_window').used)
		}

		override secondary_measured() {
			return this.quota('secondary_window').used !== null
		}

		override secondary_portion() {
			return (this.quota('secondary_window').used ?? -100) / 100
		}

		override secondary_note() {
			return this.quota('secondary_window').reset
		}

		override secondary_missing() {
			return this.quota('secondary_window').missing
		}

		override agents_text() {
			return $airkit_demo_screens_nodes_agents_text(this.node())
		}

		override usage_content() {
			if (!this.agents().length) return [this.Empty()]

			return [this.Columns(), this.List()]
		}

		override agent_rows() {
			return this.agents().map(agent => this.Agent_row(agent.agentId))
		}

		agent(id: string) {
			const found = this.agents().find(agent => agent.agentId === id)
			if (!found) throw new Error(`Agent ${id} is gone`)

			return found
		}

		override agent_name(id: string) {
			return this.agent(id).agentId
		}

		override agent_share(id: string) {
			const share = this.agent(id).sharePercent

			return share == null ? 'not yet observed' : share.toFixed(1) + '%'
		}

		override agent_limit(id: string) {
			const limit = this.agent(id).limitPercent

			return limit == null ? 'no limit' : limit + '%'
		}

		override agent_model(id: string) {
			return this.agent(id).model ?? 'unknown model'
		}

		override agent_input(id: string) {
			return this.agent(id).inputTokens.toLocaleString()
		}

		override agent_cached(id: string) {
			return this.agent(id).cachedInputTokens.toLocaleString()
		}

		override agent_output(id: string) {
			return this.agent(id).outputTokens.toLocaleString()
		}

		override agent_reasoning(id: string) {
			return this.agent(id).reasoningTokens.toLocaleString()
		}

		override agent_requests(id: string) {
			return this.agent(id).requests.toLocaleString()
		}

		override agent_peak(id: string) {
			return this.agent(id).maxInputTokens.toLocaleString()
		}
	}
}
