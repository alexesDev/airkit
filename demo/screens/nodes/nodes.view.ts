namespace $.$$ {
	export class $airkit_demo_screens_nodes extends $.$airkit_demo_screens_nodes {
		@$mol_mem
		override spreads(): Record<string, $mol_view> {
			const spreads: Record<string, $mol_view> = {}
			for (const node of $airkit_demo_screens_nodes_sample) spreads[node.name] = this.Show(node.name)

			return spreads
		}

		override node_name(id: string) {
			return id
		}

		override spread_title(id: string) {
			return id
		}

		node(id: string) {
			return $airkit_demo_screens_nodes_find(id)
		}

		override row_name(id: string) {
			return this.node(id).name
		}

		override row_credential(id: string) {
			return $airkit_demo_screens_nodes_credential(this.node(id)).text
		}

		override row_tone(id: string) {
			return $airkit_demo_screens_nodes_credential(this.node(id)).tone
		}

		override row_primary(id: string) {
			return $airkit_demo_screens_nodes_quota(this.node(id), 'primary_window').text
		}

		override row_secondary(id: string) {
			return $airkit_demo_screens_nodes_quota(this.node(id), 'secondary_window').text
		}

		override row_observed(id: string) {
			return $airkit_demo_screens_nodes_observed(this.node(id))
		}

		override row_agents(id: string) {
			return $airkit_demo_screens_nodes_agents_text(this.node(id))
		}
	}
}
