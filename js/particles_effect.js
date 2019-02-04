function ParticleObj(Emitter, RenderClass, PartPosX, PartPosY, Transition, Frequency, PartSize, Amplitude, _Index, ParticlesDirection){
    this.Emitter = Emitter;
    this.RenderClass = RenderClass || "NoClass";
    this.PartPosX = PartPosX;
    this.PartPosY = PartPosY;
    this.Transition = Transition;
    this.Frequency = Frequency;
    this.PartSize = PartSize;
    this.Amplitude = Amplitude;
    this._Index = _Index;
    this.ParticlesDirection = ParticlesDirection;

    var _ParticleDom = document.createElement("div");
    _ParticleDom.id = this.Emitter + "-" + this._Index;
    _ParticleDom.classList.add(this.RenderClass);
    _ParticleDom.style.position = "absolute";
    _ParticleDom.style.transition = "all " + (this.Transition / 1000) + "s";
    _ParticleDom.style.width = this.PartSize + "px";
    _ParticleDom.style.height = this.PartSize + "px";
    _ParticleDom.style.top = Math.floor(this.PartPosY) + "px";
    _ParticleDom.style.left = Math.floor(this.PartPosX) + "px";
    _ParticleDom.style.zIndex = "1000000";

    document.body.appendChild(_ParticleDom);

    this.AnimateParticle = function(){
        var _this = this;
        setTimeout(function(){
            _ParticleDom.style.transform = "translate3d(" + (_this.ParticlesDirection[0] * _this.Amplitude) + "px, " + (_this.ParticlesDirection[1] * _this.Amplitude) + "px, 0)";
        }, (_this.Frequency));
        setTimeout(function(){
            _ParticleDom.style.transition = "all 0.3s";
            _ParticleDom.style.opacity = "0";
        }, _this.Transition);
        setTimeout(function(){
            _ParticleDom.remove();
        }, ((_this.Transition + _this.Frequency) + 100));
    };
}

function ParticleSys(Emitter, RenderClass, Transition, Frequency, SizeMin, SizeMax, Amplitude, ParticlesDirection){
    this.Emitter = Emitter;
    this.RenderClass = RenderClass;
    this.Transition = Transition;
    this.Frequency = Frequency;
    this.SizeMin = SizeMin;
    this.SizeMax = SizeMax;
    this.Amplitude = Amplitude;
    this.ParticlesDirection = ParticlesDirection;

    var PartEmition;

    this.RenderParticles = function(){
        var _this = this;
        var i = 0;
        PartEmition = setInterval(function(){
            var EmitterSizeX = document.getElementById(_this.Emitter).getBoundingClientRect().width;
            var EmitterSizeY = document.getElementById(_this.Emitter).getBoundingClientRect().height;
            var EmitterPosX = document.getElementById(_this.Emitter).getBoundingClientRect().left;
            var EmitterPosY = document.getElementById(_this.Emitter).getBoundingClientRect().top;
            var PartSize = Math.floor(Math.random() * (_this.SizeMax - _this.SizeMin)) + _this.SizeMin;
            var PartPosX = (Math.floor(Math.random() * ((EmitterPosX + EmitterSizeX) - EmitterPosX)) + EmitterPosX) - (PartSize / 2);
            var PartPosY = (Math.floor(Math.random() * ((EmitterPosY + EmitterSizeY) - EmitterPosY)) + EmitterPosY) - (PartSize / 2);
            var _Particle = new ParticleObj(_this.Emitter, _this.RenderClass, PartPosX, PartPosY, _this.Transition, _this.Frequency, PartSize, _this.Amplitude, i, _this.ParticlesDirection);
            _Particle.AnimateParticle();
            i++;
        }, _this.Frequency);
    };

    this.RenderParticlesExplosion = function(){
        var _this = this;
        var i = 0;
        PartEmition = setInterval(function(){
            var EmitterSizeX = document.getElementById(_this.Emitter).getBoundingClientRect().width;
            var EmitterSizeY = document.getElementById(_this.Emitter).getBoundingClientRect().height;
            var EmitterPosX = document.getElementById(_this.Emitter).getBoundingClientRect().left;
            var EmitterPosY = document.getElementById(_this.Emitter).getBoundingClientRect().top;
            var PartSize = Math.floor(Math.random() * (_this.SizeMax - _this.SizeMin)) + _this.SizeMin;
            var PartPosX = (Math.floor(Math.random() * ((EmitterPosX + EmitterSizeX) - EmitterPosX)) + EmitterPosX) - (PartSize / 2);
            var PartPosY = (Math.floor(Math.random() * ((EmitterPosY + EmitterSizeY) - EmitterPosY)) + EmitterPosY) - (PartSize / 2);
            var DirectionX = (Math.random() * 2) - 1;
            var DirectionY = (Math.random() * 2) - 1;
            _this.ParticlesDirection = [DirectionX, DirectionY];
            var _Particle = new ParticleObj(_this.Emitter, _this.RenderClass, PartPosX, PartPosY, _this.Transition, _this.Frequency, PartSize, _this.Amplitude, i, _this.ParticlesDirection);
            _Particle.AnimateParticle();
            if(((i - 1) * _this.Frequency) >= 200){
                _this.KillParticles();
            }
            i++;
        }, _this.Frequency);
    };

    this.KillParticles = function(){
        clearInterval(PartEmition);
    };
}