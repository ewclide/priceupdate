export function fetchSettings(settings, defaults, attributes, element)
{
	var result = {}

	for (var i in defaults)
	{
		if (settings[i] === undefined)
		{
			var attr = element && attributes[i]
				? element.getAttribute('data-' + attributes[i]) : null;
				
			var num = +attr;

			if (attr === "" || attr === "true")
				attr = true;

			else if (attr === "false")
				attr = false;

			else if (attr !== null && !isNaN(num))
				attr = num;

			result[i] = attr !== null ? attr : defaults[i];
		}
		else result[i] = settings[i];
	}

	return result;
}

export function getFunction(str)
{
	if (typeof str == "string")
		return new Function("e", str);

	else if (typeof str == "function")
		return str;

	else return null;
}