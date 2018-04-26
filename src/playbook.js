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
            paused: false
        }

        this._plays.push(myPlaybook);
        this._runPlaybook(myPlaybook);

        return myPlaybook;
    }

    /**
      * PRIVATE
    **/
    this._runPlaybook = function(playbook){
        while(playbook.currentDirectionIndex < playbook.playbookObj.directions.length){
            var nextDirection = playbook.playbookObj.directions[playbook.currentDirectionIndex];
            var nextActor = playbook.playbookObj.actors[nextDirection.actor_id];

            console.log(nextDirection, nextActor);
            this._executePlaybookDirection(nextActor, nextDirection, playbook);

            playbook.currentDirectionIndex++;
        }
    }

    /**
      * PRIVATE
    **/
    this._executePlaybookDirection = function(actor, direction, playbook){
        switch(direction.type){
            case 'create_actor':
                this._createActor(actor, direction.parameters, playbook);
                break;
            case 'move_actor':
                this._moveActor(actor, direction.parameters, playbook);
                break;
        }
    }

    /**
      * PRIVATE
    **/
    this._createActor = function(actor, parameters, playbook){
        var initPos = parameters.initial_position || {x: -500, y: -500};
        var initFrame = parameters.initial_frame || 0;
        
        actor.sprite = this.scene.add.sprite(initPos.x, initPos.y, actor.sprite_key, initFrame);
    }

    /**
      *
    **/
    this._moveActor = function(actor, parameters, playbook){
        var newPos = parameters.new_position;
        var duration = parameters.duration || 1000;

        if(!actor.sprite){
            this._createActor(actor, { }, playbook);
        }

        this.scene.add.tween({
            targets: actor.sprite,
            x: newPos.x,
            y: newPos.x,
            duration: duration
        });
    }
}

/**
  * Called by Phaser during the load.plugin call.  Registers itself as a Phaser plugin.
**/
PhaserPlaybook.register = function(PluginManager){
    PluginManager.register('PhaserPlaybook', PhaserPlaybook, 'phaserPlaybook');
}

