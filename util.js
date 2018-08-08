((window, $, handlebars) => {
    // handlebars helpers
    
    handlebars.registerHelper('date', (dateStr) => {
      dateStr = dateStr.split(' ').join('T') + 'Z';
      let date = new Date(dateStr).getTime();
      let now = Date.now();
      let diff = now - date;
      let minutes = Math.floor(diff / (1000 * 60)) // minutes
      let amount = minutes;
      if (minutes <= 2) {
        return 'Just now';
      }
      let unit = 'minute';
      if (minutes >= 60) {
        unit = 'hour';
        amount = Math.floor(minutes / 60);
      } else if(minutes >= 60 * 24) {
        unit = 'day';
        amount = Math.floor(minutes / 60 * 24);
      }
      
      if(amount > 1) {
        unit += 's';
      }
      return amount + ' '  + unit + ' ago';
    });
    
    window.utils = {
      getTemplate: (id) => {
        return handlebars.compile($(id).html());
      }
    }
  
  })(window, $, window.Handlebars);
  
  