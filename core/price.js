import { fetchSettings, getFunction } from './func';
import Option from './option';
import Animation from './anim';

var defaults = {
    value     : 0,
    currency  : '$',
    space     : false,
    template  : null,
    points    : '',
    oldPrice  : false,
    oldValue  : 0,
    factor    : 0,
    animation : false,
    duration  : 500,
    onChange  : null,
    onReady   : null,
    onAnimUpdate : null
}

var attributes = {
    value     : 'value',
    currency  : 'currency',
    space     : 'space',
    template  : 'template',
    points    : 'points',
    oldPrice  : 'old-price',
    oldValue  : 'old-value',
    factor    : 'factor',
    animation : 'animation',
    duration  : 'duration',
    onChange  : 'on-change',
    onReady   : 'on-ready',
}

export default class Price
{
    constructor(source, settings)
    {
        settings = fetchSettings(settings, defaults, attributes, source);

        this.element = source;
        this.value = parseFloat(settings.value || source.innerText);
        this.currency = settings.currency;
        this.space = settings.space ? ' ' : '';
        this.template = settings.template;
        this.updatedValue = this.value;
        this.options = {};
        this.activeList = {};
        this.onChange = getFunction(settings.onChange);
        this.onReady  = getFunction(settings.onReady);
        this.onAnimUpdate = getFunction(settings.onAnimUpdate);

        if (settings.animation)
            this.animation = new Animation({
                timing   : getFunction(settings.timing),
                duration : settings.duration,
                onUpdate : (e) => {
                    this._insert(Math.round(e.value));

                    if (typeof this.onAnimUpdate == 'function')
                        this.onAnimUpdate(e);
                }
            });

        this._getOldPrice(
            settings.oldPrice,
            settings.oldValue,
            settings.factor
        );

        this._getOptions(settings.points);

        if (typeof this.onReady == 'function')
            this.onReady(this);

        this._insert(this.value);
    }

    _getOldPrice(query, oldValue, factor)
    {
        var oldElement = query ? document.querySelector(query) : false;
        if (!oldElement) return;

        if (!oldValue)
            oldValue = parseFloat(oldElement.innerText);

        if (!oldValue && factor)
            oldValue = this.value * factor;

        else if (oldValue && !factor)
            factor = oldValue / this.value;

        else if (!factor && !oldValue) return;

        this.oldElement = oldElement;
        this.oldValue = oldValue;
        this.factor = factor;
    }

    get isPrice()
    {
        return true;
    }

    _getOptions(points)
    {
        var query = points ? `[data-target='${points}']` : '[data-point]',
            list = document.querySelectorAll(query);

        for (var i = 0; i < list.length; i++)
            this.attachOption(list[i]);
    }

    _updateActiveList(option)
    {
        var active = option.active,
            name = option.name;

        if (active) this.activeList[name] = option;
        else delete this.activeList[name];
    }

    _updatePrice()
    {
        var price = this.value;

        for (var i in this.activeList)
        {
            var option = this.activeList[i],
                markup = price - this.value;

            switch (option.operator)
            {
                case '+'  : price += option.value; break;
                case '-'  : price -= option.value; break;
                case '*'  : price = this.value * option.value + markup; break;
                case '/'  : price = this.value / option.value + markup; break;
                case '+%' : price = this.value + (this.value / 100) * option.value + markup; break;
                case '-%' : price = this.value - (this.value / 100) * option.value + markup; break;
            }
        }

        if (this.animation)
        {
            this.animation.setInterpState(this.updatedValue, price);
            this.animation.play();
        }
        else this._insert(price);

        this.updatedValue = price;
    }

    _insert(price)
    {
        var resPrice = this._draw(price);

        this.element.value = resPrice;
        this.element.innerHTML = resPrice;

        if (this.oldElement)
        {
            var oldValue = Math.round(this.factor * price);

            resPrice = this._draw(oldValue);

            this.oldElement.innerHTML = resPrice;
            this.oldValue = oldValue;
        }
    }

    _draw(value)
    {
        var result = '';

        if (this.template)
        {
            result = this.template;
            result = result.replace(/\{value\}/gi, value);
            result = result.replace(/\{currency\}/gi, this.currency);
        }
        else result = value + this.space + this.currency;
        
        return result;
    }

    attachOption(element, operator)
    {
        var self = this,

        option = new Option(element, operator,
            function(e){
                self._updateActiveList(e);
                self._updatePrice();

                if (typeof self.onChange == 'function')
                    self.onChange({
                        value    : self.value,
                        updated  : self.updatedValue,
                        oldValue : self.oldValue
                    });
            });

        this.options[option.name] = option;
    }
}