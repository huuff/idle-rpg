# Tasks
* It's likely that Scenes should control the duration of the initial tick (e.g. displaying the encounter in Battler) and of the end tick (e.g. displaying whether you won or lost). For the end tick, I could return it from the method. No idea for the initial tick unfortunately
* Actually going somewhere (currently game breaks when finishing zone)
* Manual option of going to rest between battles
* A view to show player stats
* Maybe stats should be a class and have methods to add and multiply (also allow fractional numbers and return rounded with getters)
* Actual game over
* Some very specific tick duration in the store and make `delayBetweenScenes` and time of animations depend on it
* At the very least fix it that enemy health is depleted before the battle starts
* Setting some getter that says whether travelling is over?
