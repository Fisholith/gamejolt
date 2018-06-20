import { CreateElement } from 'vue';
import { Route } from 'vue-router';
import { Component } from 'vue-property-decorator';

import { AuthLinkedAccountProcessing } from '../../_processing/processing';
import { Api } from '../../../../../../lib/gj-lib-client/components/api/api.service';
import { Growls } from '../../../../../../lib/gj-lib-client/components/growls/growls.service';
import { Auth } from '../../../../../../lib/gj-lib-client/components/auth/auth.service';
import {
	BaseRouteComponent,
	RouteResolve,
} from '../../../../../../lib/gj-lib-client/components/route/route-component';

@Component({
	name: 'RouteAuthLinkedAccountTwitterCallback',
})
export default class RouteAuthLinkedAccountTwitterCallback extends BaseRouteComponent {
	@RouteResolve()
	routeResolve(this: undefined, route: Route) {
		const { code, state } = route.query;
		return Api.sendRequest(
			'/web/auth/linked-accounts/link_callback/twitter?code=' + code + '&state=' + state,
			{}
		);
	}

	routed($payload: any) {
		if (!$payload.success) {
			// If they don't have an account yet, let's create one for them. For
			// Twitter, they need to fill out their email address, so take them
			// to the page to do that.
			if ($payload.reason && $payload.reason === 'no-account') {
				this.$router.push({
					name: 'auth.linked-account.twitter.finalize',
					params: { state: this.$route.query.state },
				});
			} else {
				Growls.error({
					sticky: true,
					title: this.$gettext('auth.linked_account.twitter.failed_growl_title'),
					message: this.$gettext('auth.linked_account.twitter.failed_growl'),
				});
				this.$router.push({ name: 'auth.join' });
			}
			return;
		}

		Auth.redirectDashboard();
	}

	render(h: CreateElement) {
		return h(AuthLinkedAccountProcessing);
	}
}
