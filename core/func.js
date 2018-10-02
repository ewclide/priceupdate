function getBrowser()
{
    var ua = navigator.userAgent; 

    if (ua.search(/Chrome/) > 0)  return 'Chrome';
    if (ua.search(/Firefox/) > 0) return 'Firefox';
    if (ua.search(/Opera/) > 0)   return 'Opera';
    if (ua.search(/Safari/) > 0)  return 'Safari';
    if (ua.search(/MSIE|\.NET/) > 0) return 'IE';

    return false;
}

export function fetchSettings(settings, defaults, attributes, element)
{
	var result = {}

	for (var i in defaults)
	{
		if (settings[i] === undefined)
		{
			var attr = element ? element.getAttribute('data-' + (attributes[i] || i)) : null,
				num = +attr;

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