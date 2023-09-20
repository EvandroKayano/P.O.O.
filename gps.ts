export class Gps {
    constructor(
      public long: number,
      public lati: number
    ){}
  
    walkN():void{ //NORTH
      this.lati += 0.1
    }
  
    walkS():void{ // SOUTH
      this.lati -= 0.1
    }
  
    walkE():void{ //EAST
      this.long += 0.1
    }
    walkW():void{ //WEST
      this.long -= 0.1
    }
}