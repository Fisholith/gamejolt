import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { RouteStoreName, RouteStore } from '../../../views/dashboard/games/manage/manage.store';
import { Perm, Game } from '../../../../lib/gj-lib-client/components/game/game.model';

@Component({})
export class AppGamePerms extends Vue {
	@Prop(Game) game?: Game;
	@Prop({ type: String, default: '' })
	required: string;
	@Prop(Boolean) either?: boolean;
	@Prop({ type: String, default: 'span' })
	tag: string;
	@Prop(Boolean) debug?: boolean;

	get targetGame() {
		if (this.game) {
			return this.game;
		}

		const store: RouteStore | null = this.$store.state[RouteStoreName];
		if (store) {
			return store.game;
		}

		return null;
	}

	get hasPerms() {
		const perms: Perm[] = (this.required as any).split(',');

		// if (this.debug && this.targetGame) {
		// 	console.log(
		// 		'Checking that ' +
		// 			JSON.stringify(this.targetGame.perms) +
		// 			' has perms ' +
		// 			JSON.stringify(perms.filter(perm => !!perm))
		// 	);
		// }

		if (!this.targetGame) {
			throw new Error(`Target game doesn't exist for app-game-perms component.`);
		}

		return this.targetGame.hasPerms(perms.filter(perm => !!perm), this.either);
	}

	render(h: Vue.CreateElement) {
		if (this.hasPerms) {
			return h(this.tag, this.$slots.default);
		}
	}
}