import Vue from 'vue';
import VueRouter from 'vue-router';
import { Component } from 'vue-property-decorator';
import * as View from '!view!./user.html';

import { Meta } from '../../../../../../../../../lib/gj-lib-client/components/meta/meta-service';
import { RouteResolve } from '../../../../../../../../../lib/gj-lib-client/utils/router';
import { User } from '../../../../../../../../../lib/gj-lib-client/components/user/user.model';
import { UserGameScore } from '../../../../../../../../../lib/gj-lib-client/components/user/game-score/game-score.model';
import { GameScoreTable } from '../../../../../../../../../lib/gj-lib-client/components/game/score-table/score-table.model';
import { RouteState, RouteStore } from '../../../../manage.state';
import { Api } from '../../../../../../../../../lib/gj-lib-client/components/api/api.service';
import { ModalConfirm } from '../../../../../../../../../lib/gj-lib-client/components/modal/confirm/confirm-service';
import { Growls } from '../../../../../../../../../lib/gj-lib-client/components/growls/growls.service';
import { AppJolticon } from '../../../../../../../../../lib/gj-lib-client/vue/components/jolticon/jolticon';
import { AppTooltip } from '../../../../../../../../../lib/gj-lib-client/components/tooltip/tooltip';
import { AppManageGameListScores } from '../../_list-scores/list-scores';

@View
@Component({
	components: {
		AppJolticon,
		AppManageGameListScores,
	},
	directives: {
		AppTooltip,
	},
})
export default class RouteDashGamesManageApiScoreboardsScoresUser extends Vue {
	@RouteState game: RouteStore['game'];

	user: User = null as any;
	scoreTable: GameScoreTable = null as any;
	scores: UserGameScore[] = [];

	@RouteResolve()
	routeResolve(this: undefined, route: VueRouter.Route) {
		return Api.sendRequest(
			'/web/dash/developer/games/api/scores/list-table-user-scores/' +
				route.params.id +
				'/' +
				route.params.table +
				'/' +
				route.params.user
		);
	}

	routed() {
		this.user = new User(this.$payload.user);
		this.scoreTable = new GameScoreTable(this.$payload.scoreTable);
		this.scores = UserGameScore.populate(this.$payload.scores);

		Meta.title = this.$gettextInterpolate(
			'View Scores for %{ user } on %{ table } - %{ game }',
			{
				game: this.game.title,
				user: this.user.display_name,
				table: this.scoreTable.name,
			}
		);
	}

	onScoreRemoved(score: UserGameScore) {
		const index = this.scores.findIndex(i => i.id === score.id);
		if (index !== -1) {
			this.scores.splice(index, 1);
		}
	}

	async removeAll() {
		const result = await ModalConfirm.show(
			this.$gettext('dash.games.scores.user.list.remove_confirmation')
		);

		if (!result) {
			return;
		}

		await this.scoreTable.$removeAllUserScores(this.user.id);

		Growls.success(
			this.$gettext(
				`All of the user's scores have been removed from the scoreboard.`
			),
			this.$gettext(`Scores Removed`)
		);

		this.$router.push({
			name: 'dash.games.manage.api.scoreboards.scores.list',
			params: {
				table: this.scoreTable.id + '',
			},
		});
	}
}