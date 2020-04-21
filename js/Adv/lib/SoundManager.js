var SoundManager = function()
{
    this._list = [];
    this._buffers = [];
    this._path = [];
    this.connection = 10;
    this.Idx = 0;
    this.length = 0;
    this.progressIdx = 0;
    this.handler = null;
};

SoundManager.prototype.add = function( path )
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

SoundManager.prototype.load = function( cb )
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

SoundManager.prototype.progreess = function()
{
    if(this.length === 0)
        return 100;
        
    var percentage = parseInt(((this.progressIdx/this.length) * 100));
    return percentage;
};

SoundManager.prototype.resourceLoad = function( Idx )
{
    if(this._buffers[Idx])
        return;

    var src = {};
    src[this._path[Idx]] = resources[this._path[Idx]];
    
    this._buffers[Idx] = new Howl({
        src: src,
        onload: () => {
            this.progressIdx++;
    
            var percentage = parseInt(((this.progressIdx/this.length) * 100));
            if(percentage === 100)
            {
                if(this._handler)
                {
                    this._handler(this._buffers);
                }
            }
        
            if(this._path.length === this._buffers.length)
            {
                return;
            }
            
            this.resourceLoad(this.Idx);
            this.Idx++;
        },
        onloaderror: () => {
            this.progressIdx++;
    
            var percentage = parseInt(((this.progressIdx/this.length) * 100));
            if(percentage === 100)
            {
                if(this._handler)
                {
                    this._handler(this._buffers);
                }
            }
        
            if(this._path.length === this._buffers.length)
            {
                return;
            }
            
            this.resourceLoad(this.Idx);
            this.Idx++;
        }
    });
};

SoundManager.prototype.release = function()
{
    for(var i=0; i<this.length; i++)
    {
        this._buffers[i].unload();
    }

    this._list = [];
    this._Images = [];
    this._path = [];
    this.connection = 10;
    this.Idx = 0;
    this.length = 0;
    this.progressIdx = 0;
    this.handler = null;
};

SoundManager.prototype.Play = function( alias, loop, volume )
{
    alias = encodeURI(alias);
    
    var index = -1;
    for(var i=0; i<this._path.length; i++)
    {
        if(this._path[i].indexOf(alias) !== -1)
            index = i;
    }

    if(index === -1)
        return;

    this._buffers[index]._volume = 1;
    this._buffers[index]._loop = loop;

    //this._buffers[index].connect(oscillator);
    this._buffers[index].play();

    /*
    let filter = Howler.ctx.biquadFilter();
    filter.type = "square";
    filter.frequency.value = filter.frequency.maxValue * 0.5;
    filter.frequency.setValueAtTime(440, Howler.ctx.currentTime)
    filter.connect(Howler.ctx.destination)
    filter.start(0);
    */

    //this._buffers[index]._sounds[0]._node.bufferSource.connect(filter);
    this._buffers[index].fade(0, volume, 500)
};

SoundManager.prototype.Stop = function( alias )
{
    alias = encodeURI(alias);
    
    var index = -1;
    for(var i=0; i<this._path.length; i++)
    {
        if(this._path[i].indexOf(alias) !== -1)
            index = i;
    }

    if(index === -1)
        return;

    var volume = this._buffers[index]._volume;
    this._buffers[index].fade(volume, 0, 500);
};