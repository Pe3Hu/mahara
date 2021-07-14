class parquet{
  constructor( index, vertexs, board ){
    this.const = {
      index: index
    };
    this.array = {
      vertex: vertexs
    };
    this.data = {
      hue: null,
      board: board
    };

    this.init();
  }

  init(){

  }

  set_hue(){
    this.data.hue = this.const.index / this.data.board.array.parquet.length;
  }
}
