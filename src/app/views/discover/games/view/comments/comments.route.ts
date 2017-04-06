import VueRouter from 'vue-router';
import { asyncComponentLoader } from '../../../../../../lib/gj-lib-client/utils/utils';

export const routeDiscoverGamesViewComments: VueRouter.RouteConfig = {
	name: 'discover.games.view.comments',
	path: 'comments',
	component: () => asyncComponentLoader( $import( './comments' ) ),
};