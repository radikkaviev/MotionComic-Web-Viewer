var SpineManager = function()
{
    this._alias = {};
    this._list = [];
    this._Images = [];
    this._atlas = [];
    this._json = [];
    this._datas = [];
    this._path = [];
    this._textures = {};
    this.connection = 10;
    this.Idx = 0;
    this.length = 0;
    this.progressIdx = 0;
    this.handler = null;
};

SpineManager.prototype.add = function( path )
{
    if(typeof path === "string")
    {
        this._path.push(path);
    }

    else if(Array.isArray(path))
    {
        this._path = this._path.concat(path);
    }

    this._path = this._path.reduce(function(a,b){
        b = decodeURI(b);

        if(a.indexOf(b)<0)
            a.push(b);
        
        return a;
    }, []);

    this.length = this._path.length;

    return this;
};

SpineManager.prototype.load = function( cb )
{
    if(typeof cb === "function")
        this._handler = cb;

    if(this.connection > this._path.length)
    {
        this.connection = this._path.length;
    }
    
    for(var i=0; i<this.connection; i++)
    {
        this.resourceLoad(i);
    }

    this.Idx = this.connection;
};

SpineManager.prototype.progreess = function()
{
    if(this.length === 0)
        return 100;
        
    var percentage = parseInt(((this.progressIdx/this.length) * 100));
    return percentage;
};

SpineManager.prototype.resourceLoad = function( Idx )
{
    if(this._datas[Idx])
        return;
    
    if( !(resources["resource/spine/" + this._path[Idx] + "/" + this._path[Idx] + ".json"] && resources["resource/spine/" + this._path[Idx] + "/" + this._path[Idx] + ".atlas"] && resources["resource/spine/" + this._path[Idx] + "/" + this._path[Idx] + ".png"]))
    {
        this.progressIdx++;
        return;
    }

    var image = new Image();
    this._datas[Idx] = {
        data: JSON.parse(uintToString(new Uint8Array(resources["resource/spine/" + this._path[Idx] + "/" + this._path[Idx] + ".json"]))),
        atlas: uintToString(new Uint8Array(resources["resource/spine/" + this._path[Idx] + "/" + this._path[Idx] + ".atlas"])),
        image: image
    };

    var buffer = new Uint8Array( resources["resource/spine/" + this._path[Idx] + "/" + this._path[Idx] + ".png"] );
    var blob = new Blob( [ buffer ], { type: "image/png" } );
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL( blob );
    this._datas[Idx].image.src = imageUrl;
    this._alias[this._path[Idx]] = Idx;

    new pixi_spine.core.TextureAtlas(this._datas[Idx].atlas, new PIXI.BaseTexture(this._datas[Idx].image, {scaleMode:PIXI.SCALE_MODES.LINEAR, resolution: 1}), function (spineAtlas) {
        if (spineAtlas) {
            var spineJsonParser = new pixi_spine.core.SkeletonJson(new pixi_spine.core.AtlasAttachmentLoader(spineAtlas));
            this._datas[this.Idx].spineData = spineJsonParser.readSkeletonData(this._datas[this.Idx].data);
            this._datas[this.Idx].spineAtlas = spineAtlas;
        }

        this.progressIdx++;

        var percentage = parseInt(((this.progressIdx/this.length) * 100));
        if(percentage === 100)
        {
            if(this._handler)
            {
                this._handler(this._Images);
            }
        }

        if(this._path.length === this._datas.length)
        {
            return;
        }

        this.resourceLoad(this.Idx);
        this.Idx++;
    }.bind(this));
};

SpineManager.prototype.loadedHandler = function()
{   
    this.progressIdx++;

    var percentage = parseInt(((this.progressIdx/this.length) * 100));
    if(percentage === 100)
    {
        this.createTextures();

        if(this._handler)
        {
            this._handler(this._Images);
        }
    }

    if(this._path.length === this._Images.length)
    {
        return;
    }
    
    this.resourceLoad(this.Idx);
    this.Idx++;
};

SpineManager.prototype.createTextures = function()
{
    for(var i=0; i<this._Images.length; i++)
    {
        /*
        var split = this._Images[i].src.split("/");
        var folder = split[split.length-2] === undefined ? "" : split[split.length-2];
        var file = split[split.length-1];
        file = file.replace(".png", "");
        file = file.replace(".jpg", "");
        file = file.replace(".jpeg", "");
        
        var Idx = folder + "_" + file;
        */
        this._textures[decodeURI(this._Images[i].dataset.filename)] = i;
    }
};

SpineManager.prototype.getTexture = function( alias )
{
    alias = decodeURI(alias);
    alias = alias.replace(".png", "");
    alias = alias.replace(".jpg", "");
    alias = alias.replace(".jpeg", "");
    if(alias.lastIndexOf("/") !== -1)
        alias = alias.substr(alias.lastIndexOf("/") + 1, alias.length);
    
    if(alias in this._textures)
    {
        return new PIXI.Texture( new PIXI.BaseTexture( this._Images[this._textures[alias]], {scaleMode:PIXI.SCALE_MODES.LINEAR, resolution: 1}));
    }

    else
    {
        return null;
    }
};

SpineManager.prototype.getData = function( alias )
{
    alias = decodeURI(alias);
    
    if(alias in this._alias)
    {
        return this._datas[this._alias[alias]].spineData;
    }

    else
    {
        return null;
    }
};

SpineManager.prototype.getIdx = function( alias )
{
    alias = alias.replace(".png", "");
    alias = alias.replace(".jpg", "");
    alias = alias.replace(".jpeg", "");

    if(alias.lastIndexOf("/") !== -1)
        alias = alias.substr(alias.lastIndexOf("/") + 1, alias.length);

    if(alias in this._textures)
    {
        return this._textures[alias];
    }

    else
    {
        return -1;
    }
};

SpineManager.prototype.release = function()
{
    for(var i=0; i<this.length; i++)
    {
        this._Images[i].onload = null;
		this._Images[i].onerror = null;
		this._Images[i] = null;
    }

    while(this._Images.length !== 0)
    {
        this._Images.splice(0, 1);
    }

    this._textures = {};
    this._list = [];
    this._Images = [];
    this._path = [];
    this.connection = 10;
    this.Idx = 0;
    this.length = 0;
    this.progressIdx = 0;
    this.handler = null;
};