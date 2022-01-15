# Tasks
* Player should be in a `pinia` store
* It's likely that Scenes should control the duration of the initial tick (e.g. displaying the encounter in Battler) and of the end tick (e.g. displaying whether you won or lost). For the end tick, I could return it from the method. No idea for the initial tick unfortunately
* Maybe `BattleLog` is superfluous. I could have a general log for everything, and put it in a `pinia` store. At the very least I should remove the distinction between `BattleLog` and `BattleLogImpl`
* A description for when going to rest (indicating that progress is reset)
* Actually going somewhere (currently game breaks when finishing zone)
* Manual option of going to rest between battles
* A view to show player stats
* Maybe stats should be a class and have methods to add and multiply (also allow fractional numbers and return rounded with getters)
