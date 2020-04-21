var Snow = function (StopCallback) {
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
    this.parent = new PIXI.Sprite(null);
    this.Stopcb = StopCallback;

    this.Stops = [];

    for (var iCount = 0; iCount < this.m_imgCnt; iCount++) {

        var graphics = new PIXI.Graphics();
        graphics.beginFill(0xffffff, 1);
        graphics.drawCircle(0, 0, this.getRandomInt(1, 4));
        graphics.endFill();

        this.m_img[iCount] = new PIXI.Sprite(app.renderer.generateTexture(graphics));
        this.m_img[iCount].scale.set(0.5, 0.5);

        this.parent.addChild(this.m_img[iCount]);

        this.Stops[iCount] = false;
    }

    this.setImagas();
    this.SetInterval(this.windowChange.bind(this), 3);
};

Snow.prototype =
{
    StopCallback: function () {
        if (this.Stopcb)
            this.Stopcb();
        else {
            this.Destroy(false);
            this.Init(this.parent);
        }
    },

    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    draw: function (delta) {
        this.flow();

        if (this.parent === null)
            return;

        if (this.m_newWind != this.m_wind) {
            (this.m_newWind > this.m_wind) ? this.m_wind += 0.01 : this.m_wind -= 0.01;
        }

        var intervalLength = this.IntervalObject.length;
        if (intervalLength !== 0) {
            for (var iCount = 0; iCount < intervalLength; iCount++) {
                if (this.IntervalObject[iCount].WaitTime >= this.IntervalObject[iCount].LimitTime) {
                    this.IntervalObject[iCount].Callback();
                    this.IntervalObject[iCount].WaitTime = 0;
                }

                this.IntervalObject[iCount].WaitTime += delta;
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
        this.m_newWind = Math.random() * (this.m_windMax - this.m_windMin) + this.m_windMin;
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