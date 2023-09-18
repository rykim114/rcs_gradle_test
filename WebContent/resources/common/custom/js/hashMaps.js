function HashMap()
{
    // members
    this.keyArray = new Array(); // Keys
    this.valArray = new Array(); // Values
}

HashMap.prototype.set = function(key, val){
    var elementIndex = this.findIt( key );

    if( elementIndex == (-1) )
    {
        this.keyArray.push( key );
        this.valArray.push( val );
    }
    else
    {
        this.valArray[ elementIndex ] = val;
    }
};

HashMap.prototype.get = function( key ){
    var result = null;
    var elementIndex = this.findIt( key );

    if( elementIndex != (-1) )
    {
        result = this.valArray[ elementIndex ];
    }

    return result;
};

HashMap.prototype.remove = function ( key )
{
	
    var result = null;
    var elementIndex = this.findIt( key );
  
    if( elementIndex != (-1) )
    {
    	
        var part1 = this.keyArray.slice( 0, elementIndex);
        var part2 = this.keyArray.slice( elementIndex+1 );
        this.keyArray = part1.concat( part2 );
     
        var part3 = this.valArray.slice( 0, elementIndex);
        var part4 = this.valArray.slice( elementIndex+1 );
        this.valArray = part3.concat( part4 );
        
      
    }
 
    return ;
};

HashMap.prototype.size = function()
{
    return (this.keyArray.length);
};

HashMap.prototype.clear = function()
{
	while (this.keyArray.length > 0) {
		this.keyArray.pop(); this.valArray.pop();
	}
};

HashMap.prototype.keySet = function()
{
    return (this.keyArray);
};

HashMap.prototype.valSet = function()
{
    return (this.valArray);
};

HashMap.prototype.showMe = function()
{
    var result = "";

    for( var i = 0; i < this.keyArray.length; i++ )
    {
        result += "Key: " + this.keyArray[ i ] + "\tValues: " + this.valArray[ i ] + "\n";
    }
    return result;
};

 HashMap.prototype.findIt = function( key )
{
    var result = (-1);

    for( var i = 0; i < this.keyArray.length; i++ )
    {
        if( this.keyArray[ i ] == key )
        {
            result = i;
            break;
        }
    }
    return result;
};

HashMap.prototype.findCount = function( key )
{
    var result = 0;

    for( var i = 0; i < this.keyArray.length; i++ )
    {
    	 
        if( this.keyArray[ i ] == key )
        {
        	//alert('1');
            result = result++;
           // break;
        }
    }
    return result;
};