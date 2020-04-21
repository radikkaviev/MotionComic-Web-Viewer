var container = function(parent)
{
    this.zIndex = {
        //debug: 5,
        fader: 4,
        select: 3,
        text: 2,
        chara: 1,
        bg : 0
    };

    this.parent = parent;
    this.root = null;
    this.containers = {};
    this.groups = {};
    this.sprites = {};
};

container.prototype.init = function()
{
    if(!this.parent.app)
        return;

    this.root = new PIXI.Container();

    for(var name in this.zIndex)
    {
        if(name === "bg")
            continue;

        this.groups[name] = new PIXI.display.Group(this.zIndex[name], false);
        this.parent.app.stage.addChild(new PIXI.display.Layer(this.groups[name]));

        this.containers[name] = new PIXI.Container();
        this.root.addChild(this.containers[name]);
    }

    this.groups["bg"] = new PIXI.display.Group(this.zIndex["bg"], false);
    this.parent.app.stage.addChild(new PIXI.display.Layer(this.groups["bg"]));
    this.containers["bg"] = new PIXI.Container();
    
    this.parent.app.stage.addChild(this.containers["bg"]);
    this.parent.app.stage.addChild(this.root);

    var graphics = new PIXI.Graphics();
    this.addChild(graphics, "fader");
};

container.prototype.selectActivate = function( isActivate )
{
    var length = Object.keys(this.zIndex).length;

    for(var i=this.zIndex.select + 1; i<length; i++)
    {
        for(var name in this.zIndex)
        {
            if(this.zIndex[name] === i)
                this.containers[name].visible = !isActivate;
        }
    }
};

container.prototype.addChild = function(object, zIndex)
{
    zIndex = zIndex.toLowerCase();

    if(!object)
        return;
    
    if(this.zIndex[zIndex] === undefined)
        return;

    this.containers[zIndex].addChild(object);
    object.parentGroup = this.groups[zIndex];
};

container.prototype.setZindex = function(object, zIndex)
{
    zIndex = zIndex.toLowerCase();

    if(!object)
        return;
    
    if(this.zIndex[zIndex] === undefined)
        return;
    
    object.parentGroup = this.groups[zIndex];
};
