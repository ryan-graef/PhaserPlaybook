# PhaserPlaybook Documentation

### Actors

Actors are the key element of your scene.  These will be displayed on the screen and manipulated by the commands you specify.  Your playbook JSON will need an object that looks like this: 

```json
    "actors": [
        {
            "sprite_key": "mySprite",
            "actor_id": "myActor",
            "initial_position": {"x": 50, "y": 50}
        }
    ]
```

The options are as follows:

* `sprite_key`: REQUIRED.  The key of the sprite or image you want to render for the actor
* `actor_id`: REQUIRED.  The key for the actor in the scene.  This will be referenced later.
* `initial_position`: OPTIONAL.  If you would desire the actor to begin somewhere on the screen, you can use this.  If not present, the actor will begin offscreen.