var price = new PriceUpdater({
    target   : "#main",
    value    : 5000,
    currency : " RUB",
    oldPrice : "#old",
    factor   : 1.5
});

var checkBox = document.createElement("input");

checkBox.type  = "checkbox";
checkBox.name  = "new";
checkBox.value = 1000;

document.body.appendChild(checkBox);

if (price.isPrice)
    price.addOption(checkBox, "+");