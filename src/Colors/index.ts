/*
 * @poppinss/utils
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { Colors, FakeColors, Raw } from '@poppinss/colors'

export function getBest(testing: boolean, enabled: boolean) {
	if (!enabled) {
		return new Raw()
	}

	if (testing) {
		return new FakeColors()
	}

	return new Colors()
}
