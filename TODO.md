# Tasks
* More equipment items!
* I could test some stuff like inventory functions n shiet
* Rest only in settlements and remove type assertions
* Check if there's any other json I can remove
* Do a good round of checking whether everything is in its appropriate directory

# Future
* I couldn't test `basic-zones` since they have some quite intricate circular dependencies
* Thief can steal in battle for extra drops
* Thief can escape battle when in danger
* Some way that thieves cannot equip swords? Maybe weapons have strength requirements and classes can have a bonus that allows them to equip them? Or just some skill that allows their usage?
* Some better randomnes in store available items
* Some randomness in creature drops
* Some price variation (e.g. more expensive to buy than sell earning)
* Maybe loading jobclasses from JSON as I do from the rest, but there aren't many and the interface is not set in stone yet

# Hard
* Do I need `firstTick` and `lastTick`? They are 2 ticks each anyway. I could have some way of specifying how many ticks something lasts and maybe some way of specifying first and last via... I dunno, template method?. UPDATE: Tickers could just be generators! 2yields: 2 ticks. Everything would fit a single function.
