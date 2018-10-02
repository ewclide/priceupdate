import Price from './price';

var instances = {}

class PriceUpdater
{
    constructor(settings)
    {
        if (!settings || !settings.target)
        {
            console.error('PriceUpdate error: required "target" setting is empty!');
            return;
        }

        this.ids = [];

        var list = document.querySelectorAll(settings.target);

        for (var i = 0; i < list.length; i++)
        {
            let item = list[i],
                id = item.getAttribute("id") || Math.random(),
                instance = new Price(item, settings);

            instances[id] = instance;
            this.ids.push(id);
        }

        if (list.length == 1)
            return instances[this.ids[0]];
    }

    get isPriceUpdater()
    {
        return true;
    }
}

PriceUpdater.getById = function(id)
{
    if (id in instances) return instances[id];
}

var first = new PriceUpdater({
    target : "[data-priceupdater]"
});

window.PriceUpdater = PriceUpdater;