# Tasks
* I could test some stuff like inventory functions n shiet
* Now there are areas, but an archer just tries to punch everything to death instead of moving to be able to shoot
* Unlock escape settings at some level
* Cleanup dead creatures from the store
* I've used `Readonly<>` everywhere and it's quite insignifficant. Use `DeepReadonly` (any implementation) wherever I can, and where I can't, well, that's because there's mutation in there
* Use `create-vue`
* Levelling up skills by adding points manually
* Showing in what area everyone is in battle
* Autoplay option to autosell stuff on arriving to setlements
* Maybe start passing only IDs instead of full creatures around now that everything goes through the store?
  * In battle
  * In views? just get the ID and retrieve it from the store? At leas this way it wouldn't be an antipattern to edit them
* Maybe give settlements ids too? That way one wouldn't need to compare by name
* Money as an item?
* Maybe also ids for shops? I think my logic for selling/buying on them it's not too sound. These could be mutable and in the store and modify them as necessary (such as restocking etc)
* An animation for notifications?
* Another animation for earning money? Something that shows the money just appearing in a `+Amount` green animation? (or losing in red with a `-Amount`). I dunno I just wanna play with vue animations

# Future
* I couldn't test `basic-zones` since it has some quite intricate circular dependencies
* Some price variation (e.g. more expensive to buy than sell earning)
* Maybe loading jobclasses from JSON as I do from the rest, but there aren't many and the interface is not set in stone yet
* I temporarily made all `MapLocation`s settlements since that's the only type of `MapLocation` yet and for a long time to come.

# Hard
* Do I need `firstTick` and `lastTick`? They are 2 ticks each anyway. I could have some way of specifying how many ticks something lasts and maybe some way of specifying first and last via... I dunno, template method?. UPDATE: Tickers could just be generators! 2yields: 2 ticks. Everything would fit a single function.
