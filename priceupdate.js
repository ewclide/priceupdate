(function(){

    class Option
    {
        constructor(options)
        {
            this.id = Math.random();
            this.parent;
            this.$element;
            this.operator;
            this.price;
            this.calctype;
            this._init(options);
        }

        _init(options)
        {
            var self = this;

            this.parent = options.parent;
            this.$element = options.$element;

            if (this.$element)
            {
                this.name = this.$element.attr('name');
                this.type = this.$element.attr('type') || this.$element[0].nodeName.toLowerCase();
                this.operator = this.$element.attr('data-price-operator') || "+";
                this.calctype = this.$element.attr('data-price-calctype') || "update";
                this.price = (function(){
                        var price = self.$element.attr('data-price-value');
                        if (price) return parseFloat(price);
                        else return 0;
                    })();
                    
                this._checkChoosen(this.type);

                this.$element.on("change", function(){
                    if (self.type == "select") self._getSelectData();
                    self.parent.recalc(self);
                })
            }
            else
            {
                console.error("calcPrice target option reference to undefined element");
            }
        }

        _checkChoosen(type)
        {
            if (type == "select")
            {
                this._getSelectData();

                if (this.price) this.parent.recalc(this);
            }
            else if (this == "radio" || type == "checkbox")
            {
                if (this.$element.attr("checked")) this.parent.recalc(this);
            }
        }

        _getSelectData()
        {
            var option = this.$element.find('option:selected');

            this.operator = option.attr('data-price-operator');

            this.price = (function(){
                var price = option.attr('data-price-value');
                if (price) return parseFloat(price);
                else return 0;
            })();
        }
    }

    class Price
    {
        constructor(options)
        {
            this.$element;
            this.price;
            this.currency;
            this.updatePrice;
            this.points;
            this.old;
            this.oldPrice;
            this.options = {};
            this.factor;
            this._init(options);
        }

        _init(options)
        {
            var self = this;

            this.$element = options.$element;

            if (this.$element)
            {
                this.price = parseFloat(this.$element.attr("data-price-value")) || 0;

                this.currency = this.$element.attr('data-price-currency') || "";

                this.old = (function(){
                        var old = self.$element.attr('data-price-old');
                            old ? old = $(old) : old = false;
                        if (old) return old;
                        else return false;
                    })();

                this.oldPrice = self.old ? parseFloat(self.old.attr("data-price-value")) || 0 : 0;

                this.factor = (function(){
                        if (self.old) return self.oldPrice / self.price;
                        else return 0;
                    })();

                this.points = (function(){
                    var result = [];
                    var points = self.$element.attr('data-price-points') || false;
                        points ? points = $("[data-price-target='" + points + "']") : false;
                    if (points)
                    points.each(function(point){
                        var option = new Option({
                            $element : $(this),
                            parent : self
                        });
                        result.push(option);
                    });
                    return result;
                })();

            }
            else
            {
                console.error("calcPrice must have some elements for init");
            }

        }

        recalc(option)
        {
            this._addToList(option);

            var price = this.price,
                update = 0;

            for (var i in this.options)
            {
                var option = this.options[i];
                switch (option.operator)
                {
                    case "+"  : update += option.price; break;
                    case "-"  : update -= option.price; break;
                    case "*"  :
                        if (option.calctype == "update") price *= option.price;
                        else if (option.calctype == "static")
                        {
                            price = 0;
                            update += this.price * option.price;
                        }
                        break;
                    case "/"  :
                        if (option.calctype == "update") price /= option.price;
                        else if (option.calctype == "static")
                        {
                            price = 0;
                            update += this.price / option.price;
                        }
                        break;
                    case "+%" :
                        if (option.calctype == "update") update += (price / 100) * option.price;
                        else if (option.calctype == "static") update += (this.price / 100) * option.price;

                        console.log(update);

                        break;
                    case "-%" :
                        if (option.calctype == "update") update -= (price / 100) * option.price;
                        else if (option.calctype == "static") update -= (this.price / 100) * option.price;
                        break;
                }
            }

            price += update;
            this.updatePrice = price;

            this._insertPrice(price);

            if (this.old)
            {
                this.old.text(Math.round(this.factor * this.updatePrice) + this.currency);
            }
        }

        _addToList(option)
        {
            var self = this;
            if (option.type == "radio")
            {
                if (option.price)
                {
                    clearNamedOptions(option);
                    if (!(option.id in this.options)) this.options[option.id] = option;
                }
                else clearNamedOptions(option);
            }
            else if (option.type == "checkbox")
            {
                if (option.id in this.options) delete this.options[option.id];
                else this.options[option.id] = option;
            }
            else if (option.type == "select")
            {
                if (option.id in this.options)
                {
                    if (option.price) this.options[option.id] = option;
                    else delete this.options[option.id];
                }
                else this.options[option.id] = option;
            }

            function clearNamedOptions(option)
            {
                for (var i in self.options)
                {
                    if (self.options[i].type == option.type)
                    if (self.options[i].name == option.name)
                    delete self.options[i];
                }
            }
        }

        _insertPrice(price)
        {
            this.$element.val(price + this.currency);
            this.$element.text(price + this.currency);
        }
    }

    $.fn.priceupdate = function(options)
    {
        this.each(function(){
            if (options) options.$element = $(this);
            else options = { $element: $(this) };
            this.price = new Price(options);
        });
    }

    $(document).ready(function(){
        $('.priceupdate').priceupdate();
    });

})();
