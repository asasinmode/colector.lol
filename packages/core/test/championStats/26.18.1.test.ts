import type { IOverrides } from '@lolcalc/core/DamageSource.ts';
import assert from 'node:assert';
import test from 'node:test';
import { GameAbilityId } from '@lolcalc/core/GameAbilityId.ts';
import { ITEMS_BY_NAME } from '@lolcalc/data';
import { AbilityType, EFFECT_OBJECT_NAME } from '@lolcalc/shared';
import fixture from '../fixtures/26.18.1.fixture.json' with { type: 'json' };
import { overridesAppliedEffect, setupDamageSource, setupPatchFixture, typedPartialDeepStrictEqual } from '../utils.ts';

test.before(() => {
	setupPatchFixture(fixture);
});

test('26.18 Belveth', async (t) => {
	const sourceCommon: IOverrides<'Belveth'> = {
		level: 18,
		runes: {
			shards: {
				offensive: 'adaptive',
				flex: 'adaptive',
				defensive: 'health',
			},
		},
		abilityLevels: { q: 5, w: 5, e: 5, r: 3 },
	};

	await t.test('winter caressed', async () => {
		const damageSource = await setupDamageSource(fixture, 'Belveth', {
			...sourceCommon,
			items: [ITEMS_BY_NAME.infinityEdge, ITEMS_BY_NAME.ldr, ITEMS_BY_NAME.guinsoo, ITEMS_BY_NAME.krakenSlayer, ITEMS_BY_NAME.collector, ITEMS_BY_NAME.stormrazor],
			dragonStacks: ['Hextech'],
			appliedEffects: [
				overridesAppliedEffect(GameAbilityId.build(AbilityType.effect, EFFECT_OBJECT_NAME.frozenHeartWintersCaress), [1]),
			],
			internalData: { passiveStacks: 83, hasPassiveStack: 0 },
			currentAbilityResource: 0,
		});

		typedPartialDeepStrictEqual(damageSource.computed.formattedStatTotals.value, {
			attackDamage: 376,
			attackSpeed: 1.935,
		}, damageSource);

		damageSource.currentAbilityResource.value = 1;
		damageSource.internalData.value.passiveStacks = 84;
		typedPartialDeepStrictEqual(damageSource.computed.formattedStatTotals.value, {
			attackSpeed: 2.335,
		}, damageSource);
	});

	// await t.test('bloodmail+, mid quest', async () => {
	// 	const damageSource = await setupDamageSource(fixture, 'Belveth', {
	// 		...sourceCommon,
	// 		internalData: { passiveStacks: 7, hasPassiveStack: 0 },
	// 		items: [ITEMS_BY_NAME.overlordsBloodmail, ITEMS_BY_NAME.swiftmarch],
	// 		roleQuest: 'mid',
	// 	});

	// 	typedPartialDeepStrictEqual(damageSource.computed.formattedStatTotals.value, {
	// 		attackDamage: 167,
	// 	}, damageSource);
	// 	assert.strictEqual(damageSource.maxHealth.value, 3467);

	// 	damageSource.currentHealth.value = 880;
	// 	typedPartialDeepStrictEqual(damageSource.computed.formattedStatTotals.value, {
	// 		attackDamage: 188,
	// 	}, damageSource);
	// 	assert.strictEqual(damageSource.maxHealth.value, 3482);
	// });
});
