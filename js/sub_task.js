class sub_task{
  constructor( index ){
    this.const = {
      index: index
    };
    this.flag = {
    };
    this.var = {
    };
    this.array = {
    };
    this.data = {
    };

    this.set_description();
  }

  set_description(){
    switch ( this.const.index ) {
      case 0:
        this.data.name = 'climb the qualification sub_stage';
        break;
      case 1:
        this.data.name = 'find a new parquet';
        break;
      case 2:
        this.data.name = 'get raw materials';
        break;
      case 3:
        this.data.name = 'find a certain type of parquet';
        break;
      case 4:
        this.data.name = '';
        break;
      case 5:
        this.data.name = '';
        break;
    }
  }
}
