function ease(v, pow = 4){
    return 1 - Math.pow(1 - v, pow);
}

function linear(v){
    return v;
}

export default class Animation
{
    constructor(settings)
    {
        this.timing = settings.timing || linear;
        this.duration = settings.duration || 700;
        this.onUpdate = settings.onUpdate;
        this.from = 0;
        this.to = 1;
        this._startTime = 0;
        this._stopFlag = false;
    }

    setInterpState(from, to)
    {
        this.from = from;
        this.to = to;
    }

    _update(time)
    {
        var self = this,
            fraction = (time - this._startTime) / this.duration,
            progress = 0,
            value = this.from;

        if (fraction < 0) fraction = 0;
        if (fraction > 1)
        {
            fraction = 1;
            this._stopFlag = true;
        }

        progress = this.timing(fraction);
        value += progress * (this.to - this.from);

        this.onUpdate(value);

        if (!this._stopFlag)
            requestAnimationFrame(function(t){
                self._update(t);
            });
    }

    play()
    {
        this._stopFlag = false;
        this._startTime = performance.now();
        this._update(this._startTime);
    }

    stop()
    {
        this._stopFlag = true;
    }
}