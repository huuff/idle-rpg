# Tasks
* I could test some stuff like inventory functions n shiet
* Now there are areas, but an archer just tries to punch everything to death instead of moving to be able to shoot
* Unlock escape settings at some level
* Autosave & Autoload
* Levelling up skills by adding points manually
* Showing in what area everyone is in battle

# Future
* I couldn't test `basic-zones` since it has some quite intricate circular dependencies
* Some price variation (e.g. more expensive to buy than sell earning)
* Maybe loading jobclasses from JSON as I do from the rest, but there aren't many and the interface is not set in stone yet
* I temporarily made all `MapLocation`s settlements since that's the only type of `MapLocation` yet and for a long time to come.

# Hard
* Do I need `firstTick` and `lastTick`? They are 2 ticks each anyway. I could have some way of specifying how many ticks something lasts and maybe some way of specifying first and last via... I dunno, template method?. UPDATE: Tickers could just be generators! 2yields: 2 ticks. Everything would fit a single function.
