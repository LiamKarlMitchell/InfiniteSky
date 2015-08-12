function characterInventoryView(){
  this.width = 8;
  this.height = 8;
  this.items = [];
}

var prototype = characterInventoryView.prototype;

prototype.addItem = function(item){
  switch(item.info.ItemType){
    case 2:
    case 7:
    case 11:
    item.Size = 0;
    break;

    default:
    item.Size = 1;
    break;
  }
  this.items.push(item);
};

prototype.getItem = function(x, y){
  for(var i=0; i<this.items.length; i++){
    var item = this.items[i];
    if(item === undefined || item === null) continue;
    if(
      (item.Row === x || item.Row+item.Size === x) && (item.Column === y || item.Column+item.Size === y)
    ) return item;
  }
  return null;
};

prototype.render = function(){
  window.app.container.inventory.html("");

  for(var x=0; x<this.width; x++){
    var line = document.createElement('div');
    if(x === this.width-1) line.className = "row noBorder";
    else line.className = "row";

    for(var y=0; y<this.height; y++){
      var item = this.getItem(x, y);
      var itemView = document.createElement('div');



      if(item){
        var itemEle = document.createElement('div');
        switch(item.info.Rareness){
          case 1: itemEle.className = 'common'; break;
    			case 2: itemEle.className = 'unique'; break;
    			case 3: itemEle.className = 'rare'; break;
    			case 4: itemEle.className = 'elite'; break;
        }
        itemEle.setAttribute('index', item.Index);

        itemEle.onclick = function(){
          window.app.waitForPlacement = false;
          window.nextTick((function(){
            var index = parseInt(this.getAttribute('index'));
            var invItem = window.app.character.Inventory[index];

            window.app.selectedItem = index;
            window.app.waitForPlacement = true;

            var invActions = window.app.container.itemActions;

            if(typeof invItem.Amount !== 'undefined')
             invActions.find('input[name="Amount"]')
             .val(invItem.Amount)
             .trigger('input')
             .prop('disabled', false);
            if(typeof invItem.Combine !== 'undefined')
              invActions.find('input[name="Combine"]')
              .val(invItem.Combine).trigger('input')
              .prop('disabled', false);
            if(typeof invItem.Enchant !== 'undefined')
              invActions.find('input[name="Enchant"]')
              .val(invItem.Enchant*3).trigger('input')
              .prop('disabled', false);
            if(typeof invItem.Growth !== 'undefined')
              invActions.find('input[name="Growth"]')
              .val(invItem.Growth).trigger('input')
              .prop('disabled', false);
            if(typeof invItem.Activity !== 'undefined')
              invActions.find('input[name="Activity"]')
              .val(invItem.Activity).trigger('input')
              .prop('disabled', false);

              window.app.container.itemActionsContainer.show();
          }).bind(this));
        }

        itemEle.onmouseover = function(event){
          var index = parseInt(this.getAttribute('index'));
          var invItem = window.app.character.Inventory[index];
          var itemInfo = getSync('/item', {id: invItem.ID});

          var html = '';

          html += '<div class="title">'+itemInfo.Name + ' (ID: '+invItem.ID+')'+'</div>';
          var rareness;
          switch(itemInfo.Rareness){
            case 1: rareness = 'common'; break;
      			case 2: rareness = 'unique'; break;
      			case 3: rareness = 'rare'; break;
      			case 4: rareness = 'elite'; break;
          }

          html += '<div class="quality">Quality: '+rareness+'</div>';
          if(invItem.Amount) html += '<div class="quality">Amount: '+invItem.Amount+'</div>';
          if(invItem.Combine) html += '<div class="quality">Combine: '+invItem.Combine+'</div>';
          if(invItem.Enchant) html += '<div class="quality">Enchant: '+invItem.Enchant * 3+'%</div>';
          if(invItem.Growth) html += '<div class="quality">Enchant: '+invItem.Growth+'%</div>';

          window.app.container.tooltip.html(html);
          window.app.container.tooltip.show();
          clearTimeout(window.app.tooltipHideTimer);

          var top;
          var left;
          $('div[index="'+index+'"]').each(function(){
            var t = $(this).offset().top;
            var l = $(this).offset().left;

            if(!top || t < top) top = t;
            if(!left || l > left) left = l;
          });

          window.app.container.tooltip.css({left: left + $('div.slot').outerWidth(), top: top});
        }

        itemEle.onmouseout = function(event){
          window.app.tooltipHideTimer = setTimeout(function(){
            window.app.container.tooltip.hide();
          }, 1000);
        }

        itemView.insertBefore(itemEle, null);
      }




      itemView.setAttribute('x', x);
      itemView.setAttribute('y', y);

      itemView.onclick = function(){
        if(window.app.waitForPlacement){
          window.app.waitForPlacement = false;
          var Row = parseInt(this.getAttribute('x'));
          var Column = parseInt(this.getAttribute('y'));
          var obj = {};
          obj.Row = Row;
          obj.Column = Column;

          window.app.socket.emit('set', window.app.character.Name, window.app.selectedItem, obj);
          console.log(Row, Column);
        }
      }

      if(y === this.height-1)
        itemView.className = "slot noBorder";
      else
        itemView.className = "slot";

      line.insertBefore(itemView, null);
    }

    var clearingDiv = document.createElement('div');
    clearingDiv.className = 'clear';
    line.insertBefore(clearingDiv, null);

    window.app.container.inventory.append(line);
  }
};
