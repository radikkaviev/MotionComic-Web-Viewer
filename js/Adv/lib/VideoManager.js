var VideoManager = function()
{
    this._list = [];
    this._Videos = [];
    this._path = [];
    this._textures = {};
    this.connection = 10;
    this.Idx = 0;
    this.length = 0;
    this.progressIdx = 0;
    this.handler = null;
    this.endedHandler = {};
};

VideoManager.prototype.add = function( path )
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
        if(a.indexOf(b)<0)
            a.push(b);
        
        return a;
    }, []);

    this.length = this._path.length;

    return this;
};

VideoManager.prototype.load = function( cb )
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

VideoManager.prototype.progreess = function()
{
    if(this.length === 0)
        return 100;
        
    var percentage = parseInt(((this.progressIdx/this.length) * 100));
    return percentage;
};

VideoManager.prototype.resourceLoad = function( Idx )
{
    if(this._Videos[Idx])
        return;
    
    this._Videos[Idx] = document.createElement("video");
    this._Videos[Idx].crossOrigin = "anonymous";
    this._Videos[Idx].setAttribute('preload', 'auto');
    this._Videos[Idx].setAttribute('webkit-playsinline', '');
    this._Videos[Idx].setAttribute('playsinline', '');

    var sourceElement = document.createElement('source');

    var src = this._path[Idx];
    var baseSrc = src.split('?').shift().toLowerCase();
	var ext = baseSrc.substr(baseSrc.lastIndexOf('.') + 1);

    var mime = "video/" + ext;

    sourceElement.src = src;
    sourceElement.type = mime;

    this._Videos[Idx].appendChild(sourceElement);
    this._Videos[Idx].addEventListener('canplaythrough', this._onCanPlay.bind(this));
    this._Videos[Idx].addEventListener('ended', this._onEnded.bind(this));
};

VideoManager.prototype._onEnded = function(e)
{
    var baseSrc = e.target.children[0].src;
    var alias = baseSrc.substr(baseSrc.lastIndexOf('/') + 1);

    if(this.endedHandler[alias])
        this.endedHandler[alias]();
};

VideoManager.prototype.appendEndCbk = function( alias, callback )
{
    this.endedHandler[alias] = callback;
};

VideoManager.prototype._onCanPlay = function()
{
    this.progressIdx++;

    var percentage = parseInt(((this.progressIdx/this.length) * 100));
    if(percentage === 100)
    {
        this.createTextures();

        if(this._handler)
        {
            this._handler(this._Videos);
        }
    }

    if(this._path.length === this._Videos.length)
    {
        return;
    }
    
    this.resourceLoad(this.Idx);
    this.Idx++;
};

VideoManager.prototype.createTextures = function()
{
    for(var i=0; i<this._Videos.length; i++)
    {
        var startIdx = this._path[i].lastIndexOf("/");
        var endIdx = this._path[i].lastIndexOf(".");
        var Idx = this._path[i].slice(startIdx+1, endIdx);

        this._textures[Idx] = i;

        this._Videos[i].removeEventListener('canplaythrough', this._onCanPlay);
    }
};

VideoManager.prototype.getTexture = function( alias )
{
    alias = alias.replace(".mp4", "");
    alias = alias.replace(".avi", "");
    if(alias.lastIndexOf("/") !== -1)
        alias = alias.substr(alias.lastIndexOf("/") + 1, alias.length);
    
    if(alias in this._textures)
    {
        return new PIXI.Texture( new PIXI.BaseTexture( this._Videos[this._textures[alias]], {scaleMode:PIXI.SCALE_MODES.LINEAR, resolution: 1}));
    }

    else
    {
        return null;
    }
};

VideoManager.prototype.getIdx = function( alias )
{
    alias = alias.replace(".mp4", "");
    alias = alias.replace(".avi", "");

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

VideoManager.prototype.release = function()
{
    for(var i=0; i<this.length; i++)
    {
        for(var j=0; j<this._Videos[i].children.length; j++)
        {
            this._Videos[i].removeChild(this._Videos[i].children[j]);
        }

        this._Videos[i].removeEventListener('ended', this._onEnded);
		this._Videos[i] = null;
    }

    while(this._Videos.length !== 0)
    {
        this._Videos.splice(0, 1);
    }

    this._textures = {};
    this._list = [];
    this._Videos = [];
    this._path = [];
    this.connection = 10;
    this.Idx = 0;
    this.length = 0;
    this.progressIdx = 0;
    this.handler = null;
};