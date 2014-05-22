(function (_) {
    /**
     * The polygon tool
     * @class IFPolygonTool
     * @extends IFShapeTool
     * @constructor
     * @version 1.0
     */
    function IFPolygonTool() {
        IFShapeTool.call(this, false, false);
    }

    IFObject.inherit(IFPolygonTool, IFShapeTool);

    /**
     * @type {number}
     * @private
     */
    IFPolygonTool.prototype._numberOfPoints = 6;

    /**
     * @type {number}
     * @private
     */
    IFPolygonTool.prototype._innerRadiusFactor = 0.5;

    /** @override */
    IFPolygonTool.prototype.getGroup = function () {
        return 'draw';
    };

    /** @override */
    IFPolygonTool.prototype.getIcon = function () {
        return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0.5 18.5 18 18">\n<path stroke="none" d="M13.4,20.5l3.9,7l-3.9,7H5.6l-3.9-7l3.9-7H13.4 M14,19.5H5l-4.5,8l4.5,8h9l4.5-8L14,19.5L14,19.5z"/>\n</svg>\n';
    };

    /** @override */
    IFPolygonTool.prototype.getHint = function () {
        return IFShapeTool.prototype.getHint.call(this)
            .addKey(IFKey.Constant.UP, new IFLocale.Key(IFPolygonTool, "shortcut.shift"))
            .addKey(IFKey.Constant.DOWN, new IFLocale.Key(IFPolygonTool, "shortcut.option"))
            .setTitle(new IFLocale.Key(IFPolygonTool, "title"));
    };

    /** @override */
    IFPolygonTool.prototype.getActivationCharacters = function () {
        return ['G'];
    };

    /** @override */
    IFPolygonTool.prototype._modifiersChanged = function (event) {
        if (event.changed.shiftKey || event.changed.optionKey) {
            this._invalidateShape();
        }
        IFShapeTool.prototype._modifiersChanged.call(this, event);
    };

    /** @override */
    IFPolygonTool.prototype._createShape = function () {
        return new IFPolygon();
    };

    /** @override */
    IFPolygonTool.prototype._updateShape = function (shape, area, line) {
        var deltaX = line[1].getX() - line[0].getX();
        var deltaY = line[1].getY() - line[0].getY();
        var angle = ifMath.normalizeAngleRadians(Math.atan2(deltaY, deltaX));
        var distance = ifMath.ptDist(line[1].getX(), line[1].getY(), line[0].getX(), line[0].getY());

        // Lock angle to 15° if desired
        if (gPlatform.modifiers.shiftKey) {
            angle = Math.round(angle * 12 / Math.PI) * Math.PI / 12;
        }

        var outerAngle = angle;
        var innerAngle = ifMath.normalizeAngleRadians(angle + Math.PI / this._numberOfPoints);

        var outerRadius = distance;
        var innerRadius = distance * Math.cos(Math.PI / this._numberOfPoints);

        if (gPlatform.modifiers.optionKey) {
            innerRadius = distance * this._innerRadiusFactor;
        }

        shape.setProperties(['pts', 'cx', 'cy', 'ir', 'or', 'ia', 'oa'],
            [this._numberOfPoints, line[0].getX(), line[0].getY(), innerRadius, outerRadius, innerAngle, outerAngle]);
    };

    /** @override */
    IFPolygonTool.prototype._hasCenterCross = function () {
        return true;
    };

    /** override */
    IFPolygonTool.prototype.toString = function () {
        return "[Object IFPolygonTool]";
    };

    _.IFPolygonTool = IFPolygonTool;
})(this);