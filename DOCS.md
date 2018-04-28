# PhaserPlaybook Documentation

## Defaults

Defaults are default values you want to apply to various things in the playbook when they're not explicitly defined.

```json
    "defaults": {
        "movement_speed": 100
    },
```

### Defaults Options

#### movement_speed

The default movement_speed option you want to be applied to your actors.  Useful if you want consistent movement throughout the playbook.



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

### Actors Options

#### movement_speed

The speed at which you want the actor to move around the screen for move_actor commands.  If not explicitly defined, the value will be the value for movement_speed from defaults.  If that's not defined, it will be 0 (the actor will teleport for all move_actor commands).



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
* `parameters`: optional.  Parameters that will be used to execute the direction.  Most directions require these, but not all.


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
* `duration`: optional.  Given in ms.  If not given, will attempt to calculate the duration via the actor's movement_speed.  If that's not defined, the duration will be 1000ms.
* `block_scene`: optional.  Defaults to true.  If set to false, the playbook will immediately run the next direction instead of waiting for the movement to complete.


#### teleport_actor

Teleports the actor instantly to the designated spot.  Useful to make an actor move suddenly with no tween.

Parameters:

* `new_position`: REQUIRED.  An object with `x` and `y` properties defining where the actor will teleport to.



#### play_animation

Plays the designated animation, using that animation's configuration.  You'll need to define this on your own, as the playbook will assume it's already created.

Parameters:

* `animation_key`: REQUIRED.  The key of the animation you want to play.
* `blocks_scene`: Optional.  Defaults to true.  Set this to false if you want the next direction to begin immediately instead of waiting for the animation to complete.



#### delay_scene

Do nothing in the playbook for a duration.  Useful to create pauses and control pacing of the scene.

Parameters:

* `duration`: REQUIRED.  How long to delay playbook.