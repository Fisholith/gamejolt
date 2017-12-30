import { RouteConfig } from 'vue-router';

export const routeDashGamesManageGamePackageReleaseEdit: RouteConfig = {
	name: 'dash.games.manage.game.packages.release.edit',
	path: 'packages/:packageId(\\d+)/releases/:releaseId(\\d+)/edit',
	props: true,
	component: () =>
		import(/* webpackChunkName: "routeDashGamesManageGamePackageReleaseEdit" */ './edit'),
};
