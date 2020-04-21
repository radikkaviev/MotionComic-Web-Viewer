var Rain = function (StopCallback) {
    this.IntervalObject = [];
    this.ScrollY = 0;
    this.m_imgCnt = 25;
    this.m_aryImg = [];
    this.m_img = [];
    this.m_cvsw = 640;
    this.m_cvsh = 1136;
    this.m_imgBaseSizeW = 15;
    this.m_imgBaseSizeH = 18.5;
    this.m_aspectMax = 1.2;
    this.m_aspectMin = 1.0;
    this.m_speedMax = 1.7;
    this.m_speedMin = 0.5;
    this.m_angleAdd = 4;
    this.m_wind = 10;
    this.m_newWind = 0;
    this.m_windMax = 25;
    this.m_windMin = -10;
    this.m_idx = 0;
    this.m_idxc = 0;
    this.m_cos = 0;
    this.m_sin = 0;
    this.m_rad = Math.PI / 180;
    this.isVisible = true;
    this.isStop = false;
    this.isPlay = true;
    this.Stopcb = StopCallback;
    this.color = 0xAEC2E0;
    this.alpha = 1;

    this.parent = new PIXI.Sprite(null);
    this.graphics = new PIXI.Graphics();

    this.parent.addChild(this.graphics);

    this.Stops = [];

    this.rainDrops = 200;
    this.wind = 1;
    this.direction = "";

    this.width = 640;
    this.height = 1136;

    this.circle = function(alpha, speed, posX, posY, parent){
        this.speed = speed;
        this.xPos = posX;
        this.yPos = posY;
        this.opacity = -.03 + alpha / 10;
        this.counter = 0;
        this.parent = parent;
    };

    this.circle.prototype.destroy = function()
    {
        this.speed = null;
        this.xPos = null;
        this.yPos = null;
        this.opacity = null;
        this.counter = null;
    }

    this.circle.prototype.update = function()
    {
        this.counter += this.speed;

        var width = this.parent.width;
        var height = this.parent.height;

        this.yPos + this.counter > height && (this.xPos = Math.round(Math.random() * width * this.parent.wind + width), "right" == this.parent.direction ? this.xPos = -1 * Math.round(Math.random() * width * this.parent.wind + 25) : "left" != this.parent.direction && (this.xPos = Math.round(Math.random() * width + 1)), this.yPos = -1 * Math.round(Math.random() * height * 2 + 1), this.counter = 0);

        1 > this.parent.wind && (this.parent.wind = 1);
        "left" == this.parent.direction ? this.parent.moveParticules(this, -1, 7, 10,
            11, 5) : "right" == this.parent.direction ? this.parent.moveParticules(this, 1, 7, 10, 11, 5) : (this.parent.wind = 0, this.parent.moveParticules(this, 1, 0, 15, 3, 20));
    };
    
    this.circles = [];
    this.drawCircles();

    //this.SetInterval(this.windowChange.bind(this), 3);
};

Rain.prototype =
{
    moveParticules : function(a, b, c, d, e, f) {
		this.graphics.moveTo(a.xPos + a.counter * this.wind * b, a.yPos + a.counter);
		this.graphics.bezierCurveTo(a.xPos + a.counter * this.wind * b + c * b, a.yPos + a.counter + d, a.xPos + a.counter * this.wind * b + e * b, a.yPos + a.counter + f, a.xPos + a.counter * this.wind * b, a.yPos + a.counter)
    },
    
    StopCallback: function () {
        if (this.Stopcb)
            this.Stopcb();
        else {
            this.Destroy(false);
            this.Init(this.parent);
        }
    },

    drawCircles : function() {
		var width = this.width;
		var height = this.height;

		for (var a = 0; a < this.rainDrops; a++) {
			var b = Math.round(Math.random() * width * this.wind + width);

			"right" == this.direction ? b *= -1 : "left" != this.direction && (b = Math.round(Math.random() * width * this.wind + 1));

			var c = -1 * Math.round(Math.random() * height * 2 + 50);
			var d = 5 + 10 * Math.random();
			var e = Math.floor(10 * Math.random() + 1);
			var b = new this.circle(e, d, b, c, this);

			this.circles.push(b);
		}

	},

    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    draw: function (delta) {
        this.graphics.clear();
        this.graphics.lineStyle(1, this.color, this.alpha);

        for (var iCount = 0; iCount < this.circles.length; iCount++)
            this.circles[iCount].update();
        
        this.graphics.endFill();

        if(this.IntervalObject)
        {
            var intervalLength = this.IntervalObject.length;
            if(intervalLength !== 0)
            {
                for(var iCount = 0; iCount<intervalLength; iCount++)
                {
                    if(this.IntervalObject[iCount].WaitTime >= this.IntervalObject[iCount].LimitTime)
                    {
                        this.IntervalObject[iCount].Callback();
                        this.IntervalObject[iCount].WaitTime = 0;
                    }   

                    this.IntervalObject[iCount].WaitTime += delta;
                }
            }
        }
    },

    Stop: function () {
        this.isStop = true;
    },

    Play: function () {
        this.isPlay = true;
    },

    SetScroll: function (ScrollY) {
        this.ScrollY = ScrollY;
    },

    SetInterval: function (Callback, Time) {
        this.IntervalObject.push({
            WaitTime: 0,
            LimitTime: Time,
            Callback: Callback.bind(this),
            isInterval: true
        });
    },

    setImagas: function () {
        var aspect = 0;
        for (var i = 0; i < this.m_imgCnt; i++) {
            aspect = Math.random() * (this.m_aspectMax - this.m_aspectMin) + this.m_aspectMin;
            this.m_aryImg.push({
                "posx": Math.random() * this.m_cvsw,
                "posy": Math.random() * (100 + 468) - 468,
                "sizew": this.m_imgBaseSizeW * aspect,
                "sizeh": this.m_imgBaseSizeH * aspect,
                "aspect": aspect,
                "speedy": Math.random() * (this.m_speedMax - this.m_speedMin) + this.m_speedMin,
                "angle": Math.random() * 360,
            });
        }
    },

    flow: function () {

        var isStop = true;
        for (this.m_idx = 0; this.m_idx < this.m_imgCnt; this.m_idx++) {

            if (this.Stops[this.m_idx])
                continue;

            isStop = false;
            this.m_aryImg[this.m_idx].posx += this.m_wind / this.m_aryImg[this.m_idx].sizew;
            this.m_aryImg[this.m_idx].posy += this.m_aryImg[this.m_idx].speedy;
            (this.m_idx % 2) ? this.m_aryImg[this.m_idx].angle += 1 : this.m_aryImg[this.m_idx].angle -= 1;
            this.m_cos = Math.cos(this.m_aryImg[this.m_idx].angle * this.m_rad);
            this.m_sin = Math.sin(this.m_aryImg[this.m_idx].angle * this.m_rad);

            this.m_img[this.m_idx].position.set(this.m_aryImg[this.m_idx].posx, this.m_aryImg[this.m_idx].posy + this.ScrollY);
            this.m_img[this.m_idx].scale.set(this.m_aryImg[this.m_idx].aspect, this.m_aryImg[this.m_idx].aspect);
            /*this.m_img[this.m_idx].m_Object.skew.x = this.m_sin;
            this.m_img[this.m_idx].m_Object.skew.y = this.m_cos;*/

            if (this.m_aryImg[this.m_idx].posy >= this.m_cvsh) {
                if (this.isStop) {
                    this.Stops[this.m_idx] = true;
                }

                this.m_aryImg[this.m_idx].posy = -this.m_aryImg[this.m_idx].sizeh;
                if (this.m_imgCnt < this.m_idx) {
                    this.m_aryImg.splice(this.m_idx, 1);
                }
            }
            if (this.m_aryImg[this.m_idx].posx >= this.m_cvsw) {
                this.m_aryImg[this.m_idx].posx = -this.m_aryImg[this.m_idx].sizew;
                if (this.m_imgCnt < this.m_idx) {
                    this.m_aryImg.splice(this.m_idx, 1);
                }
            }
        }

        if (isStop && this.isPlay) {
            this.StopCallback();
            this.isPlay = false;
        }
    },

    windowChange: function () {
        this.wind = Math.random() * (this.m_windMax - this.m_windMin) + this.m_windMin;
    },

    SetVisible: function (isVisible) {
        this.isVisible = isVisible;

        for (var iCount = 0; iCount < this.m_imgCnt; iCount++) {
            this.m_img[iCount].SetVisible(isVisible);
        }
    },

    GetVisible: function () {
        return this.isVisible;
    },

    Destroy: function (isDestroyParent) {
        for (var iCount = 0; iCount < this.m_imgCnt; iCount++) {
            if (this.m_img[iCount]) {
                this.m_img[iCount].destroy(true);
                this.m_img[iCount] = null;
            }
        }

        this.parent.destroy(true);
        this.parent = null;

        this.m_img = null;

        this.m_imgCnt = 25;
        this.m_aryImg = [];
        this.m_img = [];
        this.m_cvsw = 640;
        this.m_cvsh = 1136;
        this.m_imgBaseSizeW = 15;
        this.m_imgBaseSizeH = 18.5;
        this.m_aspectMax = 1.2;
        this.m_aspectMin = 1.0;
        this.m_speedMax = 1.7;
        this.m_speedMin = 0.5;
        this.m_angleAdd = 4;
        this.m_wind = 10;
        this.m_newWind = 0;
        this.m_windMax = 25;
        this.m_windMin = 5;
        this.m_idx = 0;
        this.m_idxc = 0;
        this.m_cos = 0;
        this.m_sin = 0;
        this.m_rad = Math.PI / 180;
        this.isVisible = true;

        this.IntervalObject = null;
        this.Stopcb = null;
    },
};