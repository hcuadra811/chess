class PositionNames {

    static getPositionName(x,y) {
        
        const names_x = ['a','b','c','d','e','f','g','h']
        const names_y = ['1','2','3','4','5','6','7','8']
        
        return `${names_x[x]}${names_y[y]}`
    }
}

export default PositionNames