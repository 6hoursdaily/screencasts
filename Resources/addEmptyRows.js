function addEmptyRows(data) {
  if (data.length < 5) { 
		for (var rows = data.length; rows < 5; rows++) {
			var emptyRow = Ti.UI.createTableViewRow({height:80, backgroundColor:'#fff'});
			data.push(emptyRow);
		}
	}
}