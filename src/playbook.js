PhaserPlaybook = function() {
    this.boot = function(){
        console.log('booted');
    }


}

PhaserPlaybook.register = function(PluginManager){
    console.log('registered');
    PluginManager.register('PhaserPlaybook', PhaserPlaybook, 'phaserPlaybook');
}

