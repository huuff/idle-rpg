# Tasks
* I could test some stuff like inventory functions n shiet
* A slider for retreat autoplay HP
* A slider for escape HP
* Archer prepare and shoot
* ChooseCharacter modal take full width on smaller screensizes
* Make it so you can only save when resting
* Remove as many warnings as I can

# Future
* I couldn't test `basic-zones` since it has some quite intricate circular dependencies
* Some price variation (e.g. more expensive to buy than sell earning)
* Maybe loading jobclasses from JSON as I do from the rest, but there aren't many and the interface is not set in stone yet
* I temporarily made all `MapLocation`s settlements since that's the only type of `MapLocation` yet and for a long time to come.

# Hard
* Do I need `firstTick` and `lastTick`? They are 2 ticks each anyway. I could have some way of specifying how many ticks something lasts and maybe some way of specifying first and last via... I dunno, template method?. UPDATE: Tickers could just be generators! 2yields: 2 ticks. Everything would fit a single function.
