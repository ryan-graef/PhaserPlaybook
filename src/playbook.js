/**
  * Called after the sys.install call on a particular scene.  The scene is passed to get relevant systems.
**/
PhaserPlaybook = function(scene) {
    this.scene = scene;

    /** 
      * Called by Phaser during the sys.install call.  Installs all necessary objects onto Phaser for use in the scene.
    **/
    this.boot = function(){

    }

    /**
      * Enable this scene to run a playbook
      * playbookJsonId {string} - the id of the playbook json in the cache
    **/
    this.setPlaybook = function(playbookJsonId){
        var myPlaybook = this.scene.cache.json.get(playbookJsonId);

        if(!myPlaybook){
            throw "No playbook with id " + playbookJsonId;
        }
    }
}

/**
  * Called by Phaser during the load.plugin call.  Registers itself as a Phaser plugin.
**/
PhaserPlaybook.register = function(PluginManager){
    PluginManager.register('PhaserPlaybook', PhaserPlaybook, 'phaserPlaybook');
}

