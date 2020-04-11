import PositionNames from './PositionNames.js'

class Position {
    constructor(x,y) {
        this._x = x
        this._y = y
        this._name = PositionNames.getPositionName(x,y)
    }

    get x() {
        return this._x
    }

    get y() {
        return this._y
    }

    get name() {
        return this._name
    }

    set x(x) {
        this._x = x
    }

    set y(y) {
        this._y = y
    }
}

export default Position;