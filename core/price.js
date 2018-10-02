import { fetchSettings, getFunction } from './func';
import Option from './option';
import Animation from './anim';

var defaults = {
    value     : 0,
    currency  : '$',
    points    : '',
    oldPrice  : false,
    oldValue  : 0,
    factor    : 0,
    animation : false,
    duration  : 700,
    onChange  : null,
    onReady   : null
}

var attributes = {
    oldPrice : "old-price",
    oldValue : "old-value",
    onChange : "on-change",
    onReady  : "on-ready"
}

export default class Price
{
    constructor(source, settings)
    {
        settings = fetchSettings(settings, defaults, attributes, source);

        this.element = source;
        this.value = parseFloat(settings.value);
        this.currency = settings.currency;
        this.updatedValue = this.value;
        this.options = {};
        this.activeList = {};

        if (settings.animation)
            this.animation = new Animation({
                timing   : getFunction(settings.timing),
                duration : settings.duration,
                onUpdate : (e) => this._insert(Math.round(e))
            });

        this._getOldPrice(
            settings.oldPrice,
            settings.oldValue,
            settings.factor
        );

        this._getOptions(settings.points);

        this.onChange = getFunction(settings.onChange);
        this.onReady  = getFunction(settings.onReady);
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

        oldElement.innerText = oldValue + this.currency;
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
            this.addOption(list[i]);
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
        this.element.value = price + this.currency;
        this.element.innerText = price + this.currency;

        if (this.oldElement)
        {
            var oldValue = Math.round(this.factor * price);
            this.oldElement.innerText = oldValue + this.currency;
            this.oldValue = oldValue;
        }
    }

    addOption(element, operator)
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