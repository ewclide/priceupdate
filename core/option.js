export default class Option
{
    constructor(element, operator, onChange)
    {
        this.element  = element;
        this.name     = element.getAttribute("name") || Math.random();
        this.type     = element.getAttribute('type') || this.element.nodeName.toLowerCase();
        this.onChange = onChange;

        if (this.type == "select")
            this._data = this._getSelectData();

        else this._data = {
            operator : element.getAttribute('data-operator') || operator || "+",
            value    : parseFloat(element.value)
        }

        var self = this;
        this.element.addEventListener("change", function(e){
            if (typeof self.onChange == "function")
                self.onChange(self._getData());
        })
    }

    get active()
    {
        if (this.type == "checkbox" || this.type == "radio")
            return this.element.checked

        else if (this.type == "select")
        {
            var options = this.element.options,
                idx = this.element.selectedIndex;

            return !!options[idx].value;
        }
        else return false;
    }

    _getSelectData()
    {
        var result = [],
            list = this.element.querySelectorAll('option');

        for (var i = 0; i < list.length; i++)
            result.push({
                operator : list[i].getAttribute('data-operator') || "+",
                value    : parseFloat(list[i].value)
            });

        return result;
    }

    _getData()
    {
        var data = {
            name   : this.name,
            active : this.active
        }

        if (Array.isArray(this._data))
        {
            var idx = this.element.selectedIndex,
                option = this._data[idx];

            data.operator = option.operator;
            data.value = option.value;
        }
        else
        {
            data.operator = this._data.operator;
            data.value = this._data.value;
        }

        return data;
    }
}