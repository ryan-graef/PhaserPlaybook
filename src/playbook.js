/**
  * Called after the sys.install call on a particular scene.  The scene is passed to get relevant systems.
**/
PhaserPlaybook = function(scene) {
    this.scene = scene;
    this._plays = [];

    /** 
      * Called by Phaser during the sys.install call.  Installs all necessary objects onto Phaser for use in the scene.
    **/
    this.boot = function(){

    }

    /**
      * Enable this scene to run a playbook
      * playbookJsonId {string} - the id of the playbook json in the cache
    **/
    this.addPlaybook = function(playbookJsonId){
        var playbookObj = this.scene.cache.json.get(playbookJsonId);

        if(!playbookObj){
            throw "No playbook with id " + playbookJsonId;
        }

        var myPlaybook = {
            playbookObj: playbookObj,
            currentDirectionIndex: 0,
            paused: false,
            dialogSprites: []
        }

        this._plays.push(myPlaybook);
        this._configureDefaults(myPlaybook);
        this._runPlaybookNextDirection(myPlaybook);

        return myPlaybook;
    }
    
    /**
      * PRIVATE
    **/
    this._configureDefaults = function(playbook){
        if(playbook.playbookObj.defaults){

        }
    }

    /**
      * PRIVATE
    **/
    this._runPlaybookNextDirection = function(playbook){
        if(playbook.currentDirectionIndex < playbook.playbookObj.directions.length){
            var nextDirection = playbook.playbookObj.directions[playbook.currentDirectionIndex];
            var nextActor = playbook.playbookObj.actors[nextDirection.actor_id];

            playbook.currentDirectionIndex++;

            console.log(nextDirection, nextActor);
            this._executeDirection(nextActor, nextDirection, playbook);
        }
    }

    /**
      * PRIVATE
    **/
    this._executeDirection = function(actor, direction, playbook){
        switch(direction.type){
            case 'create_actor':
                this._createActor(actor, direction.parameters, playbook);
                break;
            case 'delay_playbook':
                this._delayPlaybook(direction.parameters, playbook);
                break;
            case 'move_actor':
                this._moveActor(actor, direction.parameters, playbook);
                break;
            case 'teleport_actor':
                this._teleportActor(actor, direction.parameters, playbook);
                break;
            case 'play_animation':
                this._playAnimation(actor, direction.parameters, playbook);
                break;
            case 'say_line':
                this._sayLine(actor, direction.parameters, playbook);
                break;
        }
    }

    /**
      * PRIVATE
    **/
    this._calculateMovementDuration = function(actorSpeed, actorOldPos, actorNewPos){
        var duration = 0;

        if(actorSpeed){
            //TODO: find if 600 is a good number or not
            duration = Phaser.Math.Distance.Between(actorOldPos.x, actorOldPos.y, actorNewPos.x, actorNewPos.y)/(actorSpeed/600);
        }

        return duration;
    }

    /**
      * PRIVATE
    **/
    this._createActor = function(actor, parameters, playbook){
        var initPos = parameters.initial_position || {x: -500, y: -500};
        var initFrame = parameters.initial_frame || 0;
        
        actor.sprite = this.scene.add.sprite(initPos.x, initPos.y, actor.sprite_key, initFrame);

        this._runPlaybookNextDirection(playbook);
    }

    /**
      * PRIVATE
    **/
    this._delayPlaybook = function(parameters, playbook, callback){
        var duration = parameters.duration || 1000;

        var me = this;
        this.scene.time.delayedCall(duration, function(){
            if(callback){
                callback();
            }

            me._runPlaybookNextDirection(playbook);
        });
    }

    /**
      * PRIVATE
    **/
    this._moveActor = function(actor, parameters, playbook){
        var newPos = parameters.new_position;
        var blockScene = parameters.block_scene !== false;

        if(!actor.sprite){
            this._createActor(actor, { }, playbook);
        }

        var duration = parameters.duration || 
                this._calculateMovementDuration(actor.movement_speed || playbook.playbookObj.defaults.movement_speed, {x: actor.sprite.x, y: actor.sprite.y}, {x: newPos.x, y: newPos.y}) || 
                1000;

        var me = this;
        this.scene.tweens.add({
            targets: actor.sprite,
            x: newPos.x,
            y: newPos.y,
            duration: duration,
            onComplete: function(){
                if(blockScene){
                    me._runPlaybookNextDirection(playbook);
                }
            }
        });

        if(!blockScene){
            me._runPlaybookNextDirection(playbook);
        }
    }

    /**
      * PRIVATE
    **/
    this._teleportActor = function(actor, parameters, playbook){
        var newPos = parameters.new_position;

        actor.sprite.x = newPos.x;
        actor.sprite.y = newPos.y;

        this._runPlaybookNextDirection(playbook);
    }

    /**
      * PRIVATE
    **/
    this._playAnimation = function(actor, parameters, playbook){
        var animationKey = parameters.animation_key;
        var blockScene = parameters.block_scene !== false;

        actor.sprite.play(animationKey);

        if(!blockScene){
            this._runPlaybookNextDirection(playbook);
        } else {
            var me = this;
            actor.sprite.once('animationcomplete', function(){
                me._runPlaybookNextDirection(playbook);
            })
        }
    }

    /**
      * PRIVATE
    **/
    this._sayLine = function(actor, parameters, playbook){
        var line = parameters.line || playbook.playbookObj.script[parameters.line_id].line || 'wasn\'t able to find line!';
        var duration = parameters.duration || 1000;
        var blockScene = parameters.block_scene !== false;

        var fontSize = 24;
        var fontFamily = 'Arial';
        var fontColor = '#FFFFFF';

        var textX = actor.sprite.x + actor.sprite.width/2;
        var textY = actor.sprite.y - actor.sprite.height/2 - fontSize;

        var newTextSprite = this.scene.add.text(textX, textY, line, 
            {
                fontFamily: fontFamily,
                fontSize: fontSize,
                color: fontColor,
                wordWrap: {
                    width: parameters.text_wrap_width || playbook.playbookObj.defaults.text_wrap_width || 500,
                    useAdvancedWrap: true
                }
            }
        );

        if(!blockScene) {
            this._runPlaybookNextDirection(playbook);
        }

        var me = this;
        this.scene.time.delayedCall(duration, function(){
            newTextSprite.destroy();

            if(blockScene){
                me._runPlaybookNextDirection(playbook);
            }
        });
    }
}

/**
  * Called by Phaser during the load.plugin call.  Registers itself as a Phaser plugin.
**/
PhaserPlaybook.register = function(PluginManager){
    PluginManager.register('PhaserPlaybook', PhaserPlaybook, 'phaserPlaybook');
}

