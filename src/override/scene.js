Crafty.extend({
    _scenes: {},
    _current: null,

    /**@
    * #Crafty.scene
    * @category Scenes, Stage
    * @trigger SceneChange - just before a new scene is initialized - { oldScene:String, newScene:String }
    * @trigger SceneDestroy - just before the current scene is destroyed - { newScene:String  }
    * @sign public void Crafty.scene(String sceneName, (Function|Object) obj[, Function uninit])
    * @param sceneName - Name of the scene to add
    * @param init - Function to execute when scene is played
    * @param uninit - Function to execute before next scene is played, after entities with `2D` are destroyed
    * @sign public void Crafty.scene(String sceneName)
    * @param sceneName - Name of scene to play
    * 
    * Method to create scenes on the stage. Pass an ID and function to register a scene.
    *
    * To play a scene, just pass the ID. When a scene is played, all
    * previously-created entities with the `2D` component are destroyed. The
    * viewport is also reset.
    *
    * If you want some entities to persist over scenes (as in, not be destroyed)
    * simply add the component `Persist`.
    *
    * @example
    * ~~~
    * Crafty.scene("loading", function(obj) {
    *           Crafty.background(obj);
    *           Crafty.e("2D, DOM, Text")
    *           .attr({ w: 100, h: 20, x: 150, y: 120 })
    *           .text("Loading")
    *           .css({ "text-align": "center"})
    *           .textColor("#FFFFFF");
    * });
    *
    * Crafty.scene("UFO_dance",
    *              function() {Crafty.background("#444"); Crafty.e("UFO");},
    *              function() {...send message to server...});
    * ~~~
    * This defines (but does not play) two scenes as discussed below.
    * ~~~
    * Crafty.scene("loading", "#000");
    * ~~~
    * This command will clear the stage by destroying all `2D` entities (except
    * those with the `Persist` component). Then it will set the background to
    * black and display the text "Loading".
    * ~~~
    * Crafty.scene("UFO_dance");
    * ~~~
    * This command will clear the stage by destroying all `2D` entities (except
    * those with the `Persist` component). Then it will set the background to
    * gray and create a UFO entity. Finally, the next time the game encounters
    * another command of the form `Crafty.scene(scene_name)` (if ever), then the
    * game will send a message to the server.
    */
    scene: function (name, obj, outro) {
        // ---FYI---
        // this._current is the name (ID) of the scene in progress.
        // this._scenes is an object like the following:
        // {'Opening scene': {'initialize': fnA, 'uninitialize': fnB},
        //  'Another scene': {'initialize': fnC, 'uninitialize': fnD}}

        // If there's one argument, play the scene
        if (arguments.length === 1 || typeof arguments[1] !== "function") {
            Crafty.trigger("SceneDestroy", {
                newScene: name
            });
            Crafty.viewport.reset();

            Crafty("2D").each(function () {
                if (!this.has("Persist")) this.destroy();
            });
            // uninitialize previous scene
            if (this._current !== null && 'uninitialize' in this._scenes[this._current]) {
                this._scenes[this._current].uninitialize.call(this);
            }
            // initialize next scene
            var oldScene = this._current;
            this._current = name;
            Crafty.trigger("SceneChange", {
                oldScene: oldScene,
                newScene: name
            });
            this._scenes[name].initialize.call(this, obj);

            return;
        }

        // If there is more than one argument, add the scene information to _scenes
        this._scenes[name] = {};
        this._scenes[name].initialize = obj;
        if (typeof outro !== 'undefined') {
            this._scenes[name].uninitialize = outro;
        }
        return;
    },

    /**@
     * #Crafty.toRGB
     * @category Graphics
     * @sign public String Crafty.scene(String hex[, Number alpha])
     * @param hex - a 6 character hex number string representing RGB color
     * @param alpha - The alpha value.
     *
     * Get a rgb string or rgba string (if `alpha` presents).
     *
     * @example
     * ~~~
     * Crafty.toRGB("ffffff"); // rgb(255,255,255)
     * Crafty.toRGB("#ffffff"); // rgb(255,255,255)
     * Crafty.toRGB("ffffff", .5); // rgba(255,255,255,0.5)
     * ~~~
     *
     * @see Text.textColor
     */
    toRGB: function (hex, alpha) {
        hex = (hex.charAt(0) === '#') ? hex.substr(1) : hex;
        var c = [],
            result;

        c[0] = parseInt(hex.substr(0, 2), 16);
        c[1] = parseInt(hex.substr(2, 2), 16);
        c[2] = parseInt(hex.substr(4, 2), 16);

        result = alpha === undefined ? 'rgb(' + c.join(',') + ')' : 'rgba(' + c.join(',') + ',' + alpha + ')';

        return result;
    }
});