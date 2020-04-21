var ImageManager = function()
{
    this._list = [];
    this._Images = [];
    this._path = [];
    this._textures = {};
    this.connection = 10;
    this.Idx = 0;
    this.length = 0;
    this.progressIdx = 0;
    this.handler = null;
};

ImageManager.prototype.add = function( path )
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

ImageManager.prototype.load = function( cb )
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

ImageManager.prototype.progreess = function()
{
    if(this.length === 0)
        return 100;
    
    var percentage = parseInt(((this.progressIdx/this.length) * 100));
    return percentage;
};

ImageManager.prototype.resourceLoad = function( Idx )
{
    if(this._Images[Idx])
        return;
    
    if(resources[this._path[Idx]] === undefined)
    {
        this.progressIdx++;
        return;
    }

    this._Images[Idx] = new Image();
    this._Images[Idx].crossOrigin = "anonymous";
    this._Images[Idx].onload = this.loadedHandler.bind(this);
    this._Images[Idx].onerror = this.loadedHandler.bind(this);

    var last = this._path[Idx].lastIndexOf(".")
    var ext = this._path[Idx].substr(last+1, this._path[Idx].length);

    var buffer = new Uint8Array( resources[this._path[Idx]] );
    var blob = new Blob( [ buffer ], { type: "image/" + ext } );
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL( blob );
    this._Images[Idx].src = imageUrl;

    var startIdx = this._path[Idx].lastIndexOf("/");
    var endIdx = this._path[Idx].lastIndexOf(".");
    var filename = this._path[Idx].slice(startIdx+1, endIdx);
    this._Images[Idx].dataset.filename = filename;
};

ImageManager.prototype.loadedHandler = function()
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

ImageManager.prototype.createTextures = function()
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

ImageManager.prototype.getTexture = function( alias )
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

ImageManager.prototype.getIdx = function( alias )
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

ImageManager.prototype.release = function()
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