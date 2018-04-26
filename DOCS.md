# PhaserPlaybook Documentation

## Actors

Actors are the key element of your scene.  These will be displayed on the screen and manipulated by the commands you specify.  Your playbook JSON will need an object that looks like this: 

```json
    "actors": {
        "myActor": {
            "sprite_key": "actor-guy"
        }
    },
```

The name of the JSON object (in this case `myActor`) is your actor_id, for reference later. The options for each actor are as follows:

* `sprite_key`: REQUIRED.  The key of the sprite or image you want to render for the actor



## Directions

Directions are the lifeblood of your scene.  These describe the actions you want to perform with your actors.  Here's how the directions json look:

```json
    "directions": [
        {
            "actor_id": "myActor",
            "type": "create_actor",
            "parameters": {
                "initial_position": {"x": 50, "y": 50},
                "initial_frame": 0
            }
        }
    ]
```

The important things every direction needs are:

* `actor_id`: REQUIRED.  This corresponds with the id of your actor in the `actors` JSON object.
* `type`: REQUIRED.  This indicates what direction you're performing.  More info on possible values below
* `parameters`: REQUIRED.  Parameters that will be used to execute the direction.


### Direction Types

#### create_actor

Actor sprites are not created initially.  You should call this if you want to create your actor with specific parameters.  If not, the first time the actor is used, this direction will be invoked internally with default parameters.

Parameters:

* `initial_position`: optional.  An object with `x` and `y` properties defining where you want your actor to spawn in.  By default, this is `x: -500, y: -500` (offscreen)
* `initial_frame`: optional. for animated sprites, the initial frame you want to show.  Defaults to 0.


#### move_actor

Performs a simple tween movement on the actor.

Parameters:

* `new_position`: REQUIRED.  An object with `x` and `y` properties defining where you want to end up.
* `duration`: optional.  Given in ms.  Defaults to 1000.