(function(){
    function Option(options)
    {
        this.id = Math.random();
        this.parent = null;
        this.elem = null;
        this.operator = null;
        this.price = null;
        this.calctype = null;
        this.init(options);
    }
    Option.prototype.init = function(options)
    {
        var self = this;
        this.parent = options.parent;
        this.elem = options.elem;
        if (this.elem)
        {
            this.name = this.elem.attr('name');
            this.type = this.elem.attr('type') || this.elem[0].nodeName.toLowerCase();
            this.operator = this.elem.attr('data-operator') || "+";
            this.calctype = this.elem.attr('data-calctype') || "update";
            this.price = (function(){
                    var price = self.elem.attr('data-price');
                    if (price) return parseFloat(price);
                    else return 0;
                })();
            this.elem.on("change", function(){
                if (self.type == "select") getSelectData();
                self.parent.recalc(self);
            })
        }
        else console.error("calcPrice target option reference to undefined element");

        function getSelectData()
        {
            var option = self.elem.find('option:selected');
            self.operator = option.attr('data-operator');
            self.price = options.price || (function(){
                    var price = option.attr('data-price');
                    if (price) return parseFloat(price);
                    else return 0;
                })();
        }
    }

    function Price(options)
    {
        this.elem = null;
        this.price = null;
        this.currency = null;
        this.updatePrice = null;
        this.targets = null;
        this.old = null;
        this.oldPrice = null;
        this.options = {};
        this.factor = null;
        this.init(options);
    }
    Price.prototype.init = function(options)
    {
        var self = this;
        this.elem = options.elem;
        if (this.elem)
        {
            this.price = parseFloat(this.elem.attr("data-price")) || 0;
            this.currency = this.elem.attr('data-currency') || "";
            this.old = (function(){
                    var old = self.elem.attr('data-old');
                        old ? old = $(old) : old = false;
                    if (old) return old;
                    else return false;
                })();
            this.oldPrice = self.old ? parseFloat(self.old.attr("data-price")) || 0 : 0;
            this.factor = (function(){
                    if (self.old) return self.oldPrice / self.price;
                    else return 0;
                })();
            this.targets = (function(){
                var result = [];
                var targets = self.elem.attr('data-targets') || false;
                    targets ? targets = $("[data-point='" + targets + "']") : false;
                if (targets)
                targets.each(function(target){
                    var option = new Option({
                        elem : $(this),
                        parent : self
                    });
                    result.push(option);
                });
                return result;
            })();
        }
        else console.error("calcPrice must have some elements for init");
    }
    Price.prototype.recalc = function(option)
    {
        this.addToList(option);
        var price = this.price;
        var update = 0;
        for (var i in this.options)
        {
            var option = this.options[i];
            switch (option.operator)
            {
                case "+"  : update += option.price; break;
                case "-"  : update -= option.price; break;
                //case "*"  : price *= option.price; break;
                case "*"  :
                    if (option.calctype == "update") price *= option.price;
                    else if (option.calctype == "static")
                    {
                        price = 0;
                        update += this.price * option.price;
                    }
                    break;
                //case "/"  : price /= option.price; break;
                case "/"  :
                    if (option.calctype == "update") price /= option.price;
                    else if (option.calctype == "static")
                    {
                        price = 0;
                        update += this.price / option.price;
                    }
                    break;
                //case "+%" : update += (this.price / 100) * option.price; break;
                case "+%" :
                    if (option.calctype == "update") update += (update / 100) * option.price;
                    else if (option.calctype == "static") update += (this.price / 100) * option.price;
                    break;
                //case "-%" : update -= (this.price / 100) * option.price; break;
                case "-%" :
                    if (option.calctype == "update") update -= (update / 100) * option.price;
                    else if (option.calctype == "static") update -= (this.price / 100) * option.price;
                    break;
            }
        }
        price += update;
        this.updatePrice = price;
        this.insertPrice(price);
        if (this.old) this.old.text(this.factor * this.updatePrice + this.currency);
    }
    Price.prototype.addToList = function(option)
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
    Price.prototype.insertPrice = function(price)
    {
        this.elem.val(price + this.currency);
        this.elem.text(price + this.currency);
    }

    $.fn.priceupdate = function(options)
    {
        this.each(function(){
            if (options) options.elem = $(this);
            else options = { elem: $(this) };
            this.price = new Price(options);
        });
    }

    $(document).ready(function(){
        $('.priceupdate').priceupdate();
    });

})();
