<script setup lang="ts">
import { GameAbilityId } from '@lolcalc/core/GameAbilityId';
import { gameAbilityImgAttrs, simpleFormattingGameAbilityImage } from '@lolcalc/core/misc';
import { STAT_ICON } from '@lolcalc/data/index';
import { AbilityType, ITEM_NAME_TO_ID } from '@lolcalc/shared/index';

const { reportAnIssue } = useReportIssueDialog();

const ambessaRImg = await gameAbilityImgAttrs(GameAbilityId.build(AbilityType.champion, 'Ambessa', 'r', 0));
const nocturneWImg = await gameAbilityImgAttrs(GameAbilityId.build(AbilityType.champion, 'Nocturne', 'w', 0));

const discrepancyMaxHealthMana = useSimpleDescription(`max <scalehealth>%i:${STAT_ICON.hp}%health</scalehealth> and <scalemana>%i:${STAT_ICON.mana}%mana</scalemana>/<scaleenergy>ability resource</scaleenergy> have a margin of error of <strong>1</strong>. Most of the differences should be coming from floating point arithmetic and the in game ui rounding the displayed value up. This means that the game displays something like <span class="code-like">2773.0000001</span> as <span class="code-like">2774</span>, even though it's effectively <span class="code-like">2773</span> ([example config](#TODO))`);
const discrepancyAttackRangeRfc = useSimpleDescription(`%i:${STAT_ICON.attackRange}%attack range with [${simpleFormattingGameAbilityImage('item', ITEM_NAME_TO_ID.rfc)} Rapid Firecannon's](https://wiki.leagueoflegends.com/en-us/Rapid_Firecannon) passive active has a margin of error of <strong>1</strong>. I don't know why ([config with chogath with R 6 stacks/rakan from test](#TODO))`);
const discrepancyBloodmailRetribution = useSimpleDescription(`<scalead>%i:${STAT_ICON.attackDamage}%attack damage</scalead> with [${simpleFormattingGameAbilityImage('item', ITEM_NAME_TO_ID.overlordsBloodmail)} Overlord's Bloodmail's](https://wiki.leagueoflegends.com/en-us/Overlord's_Bloodmail) [Retribution](https://wiki.leagueoflegends.com/en-us/Named_item_effect#Retribution) passive might be difficult to exactly verify with the game, as the game calculates it &quot;on top&quot; of other stat calculations (as if it was an external effect). For example, if in game you see a champion with <scalehealth>300 %i:${STAT_ICON.hp}%hp</scalehealth>, in that exact moment you are looking at their stats, their displayed <scalead>AD</scalead> might be lagging behind and showing the value for <scalehealth>299 %i:${STAT_ICON.hp}%hp</scalehealth> that was just there, before it regenerated. Because of this, when [Retribution](https://wiki.leagueoflegends.com/en-us/Named_item_effect#Retribution) is being calculated, <scalead>%i:${STAT_ICON.attackDamage}%attack damage's</scalead> margin of error is <strong>1</strong> within <strong>+/-5</strong> <scalehealth>%i:${STAT_ICON.hp}%current health</scalehealth> (try changing the current health in <strong>lolcalc</strong> by +/-5 and see if AD is correct)`);
</script>

<template>
	<main id="about">
		<h1>about</h1>

		<p>
			For instructions on how to use it, visit the <NuxtLink to="/guide">
				guide page
			</NuxtLink>
		</p>

		<h2>what is it?</h2>
		<p>
			<strong>lolcalc</strong> is intended to be a fully fledged, all-included <a href="https://www.leagueoflegends.com/" target="_blank">League of Legends</a> damage calculator (WIP at the moment). You should be able to choose any champion/item/rune combination and see the same* numbers you will find in game. See the "<a href="#does-it-work">does it work?</a>" section for examples.
		</p>
		<p>*with known discrepancies being</p>
		<ul>
			<li class="game-description" v-html="discrepancyMaxHealthMana" />
			<!-- 	max <img v-bind="gameIconImgAttrs(STAT_ICON.hp)">health and <img v-bind="gameIconImgAttrs(STAT_ICON.mana)">mana/ability resource have a margin of error of <strong>1</strong>. Most of the differences should be coming from floating point arithmetic and the in game ui rounding the displayed value up. This means that the game displays something like <span class="code-like">2773.0000001</span> as <span class="code-like">2774</span>, even though it's effectively <span class="code-like">2773</span> (<a href="#TODO">example config</a>) -->
			<!-- </li> -->
			<li class="game-description" v-html="discrepancyAttackRangeRfc" />
			<!-- 	<img v-bind="gameIconImgAttrs(STAT_ICON.attackRange)">attack range with <a href="https://wiki.leagueoflegends.com/en-us/Rapid_Firecannon" target="_blank"><img v-bind="rfcImg" alt="Rapid Firecannon icon">Rapid Firecannon's</a> passive active has a margin of error of <strong>1</strong>. I don't know why (<a href="#TODO">config with chogath with R 6 stacks/rakan from test</a>) -->
			<!-- </li> -->
			<li class="game-description" v-html="discrepancyBloodmailRetribution" />
		</ul>

		<h2 id="does-it-work">
			does it work?
		</h2>
		<p>
			while it's impossible for me to check all 172+ champions with every item combination, I tried my best to make it work and <NuxtLink to="/guide#guide-examples">
				here are some examples
			</NuxtLink> of it working. If you encounter a configuration that's not correctly calculated, please <button class="link-like" @click="reportAnIssue">
				report it
			</button>
		</p>
		<p class="alert info">
			for now only champions <strong>passive</strong> abilities (not QWER), items, and rune shards (not paths) calculate properly
			<Icon class="i-ph:info" />
		</p>
		<p>
			non-passive abilities (like <a href="https://wiki.leagueoflegends.com/en-us/Ambessa#Public_Execution" target="_blank"><img v-bind="ambessaRImg" alt="Ambessa R icon">Ambessa R passive</a> or <a href="https://wiki.leagueoflegends.com/en-us/Nocturne#Shroud_of_Darkness" target="_blank"><img v-bind="nocturneWImg" alt="Nocturne W icon">Nocturne W passive</a>) and <a href="https://wiki.leagueoflegends.com/en-us/Rune#Rune_paths" target="_blank">rune paths</a> <strong>are not implemented</strong> <i>(yet)</i> in the calculations. See the <NuxtLink to="/guide#test-setup">champion/item/rune setup</NuxtLink> recommended for verifying the calculations yourself
		</p>
		<p>for when these and other features will be implemented, see the <a href="#TODO">roadmap</a></p>

		<h2 id="support">support</h2>
		<p>TODO</p>

		<h2>acknowledgements</h2>
		<p>This project would not exist without <a href="https://communitydragon.org/" target="_blank">Community Dragon</a> and I want to thank its contributors, as well as people on their discord server that helped me during the development.</p>
		<p>Some of the <strong>code</strong> in this project was written using LLMs. I'd estimate LLM generated code to be less than 10% of the code base, however I do want to say that it would've taken me a few more months to get to where it is without them. The ability to paste it the stats/variables and have it guess formulas for what Riot is doing under the hood was very helpful.</p>
		<p>Thanks to all of my friends who helped me test both the website and the various champion configurations in game.</p>
		<p>Thanks to Riot Games for not chronobreaking this project 🤞</p>

		<h2>
			q&a
		</h2>
		<dl>
			<dt>ads and paywalling</dt>
			<dd>I will try my best to keep the calculator and all of its features free (+ it's <a href="https://github.com/asasinmode/lolcalc" target="_blank">open source</a>). That said, hosting costs money and maintaining it takes a lot of my time and effort. Please consider <a href="#support">supporting the project</a></dd>
		</dl>
	</main>
</template>

<style>
@layer page {
	#about,
	#guide {
		--at-apply: 'text-lg';

		.code-like {
			--at-apply: 'font-mono bg-slate-900 px-1 py-0.5 -mx-0.5 -my-0.5 rounded-sm';
		}

		a,
		.link-like {
			--at-apply: 'text-blue-400';

			&:hover {
				--at-apply: 'underline';
			}
		}

		img {
			--at-apply: 'inline-block size-5 me-[0.5ch] -translate-y-px';
		}
	}
}
</style>
