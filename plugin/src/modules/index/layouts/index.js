const layoutMap = {
	"0-1": "LayoutZero",
	"1-2": "LayoutNormal",
	"1-3": "LayoutNormal",
	"2-3": "GridColumnLayout",
	"1-1": "LayoutNormal",
	"2-4": "LayoutTwo",
	"3-2": "LayoutThree",
	"4-3": "LayoutFour",
	// "1-4": "LayoutNormal"
	"1-4": "GridColumnFour"
};

export default function getLayoutByType( type, lineQuantity ) {
	const key = `${type}-${lineQuantity}`;

	if (layoutMap[key]) {
		const component = require(`./lib/${layoutMap[key]}`);
		return component;
	}

	return null;
};