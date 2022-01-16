# Tasks
* For the top "travel bar", show either resing (and where) or traveling and from where, to where and through where
* It's likely that Scenes should control the duration of the initial tick (e.g. displaying the encounter in Battler) and of the end tick (e.g. displaying whether you won or lost). For the end tick, I could return it from the method. No idea for the initial tick unfortunately. UPDATE: Return it from the initialTick method?
* Manual option of going to rest between battles
* A view to show player stats
* Actual game over
* Initial screen to choose a character
* Setting some getter that says whether travelling is over?
* For anything tickable I should separate the ticking logic (what happens every tick) from the rest of it. (maybe?)
* Actually, now that tick length is a global through the store, I should set some standard tick lengths for things that should stay longer, like initial and final ticks
