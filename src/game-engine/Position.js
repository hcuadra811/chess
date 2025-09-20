import PositionNames from './PositionNames.js'

class Position {
    constructor(x,y) {
        this._x = x
        this._y = y
        this._name = PositionNames.getPositionName(x,y)
    }

    setPosition(x,y) {
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
}

export default Position;